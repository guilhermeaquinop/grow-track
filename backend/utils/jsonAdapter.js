const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const DATA_FILE = path.join(__dirname, '../data/mock-data.json');

// Carregar dados do arquivo JSON
async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, criar com estrutura inicial
    const initialData = {
      users: [],
      habits: [],
      habit_completions: []
    };
    await saveData(initialData);
    return initialData;
  }
}

// Salvar dados no arquivo JSON
async function saveData(data) {
  try {
    // Garantir que o diretório existe
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Erro ao salvar dados JSON:', error);
    throw error;
  }
}

// User Model Adapter
const UserAdapter = {
  async create(name, email, password) {
    const data = await loadData();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1,
      name,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString()
    };
    
    data.users.push(newUser);
    await saveData(data);
    
    return newUser.id;
  },

  async findByEmail(email) {
    const data = await loadData();
    return data.users.find(u => u.email === email) || null;
  },

  async findById(id) {
    const data = await loadData();
    const user = data.users.find(u => u.id === parseInt(id));
    if (!user) return null;
    
    // Retornar sem a senha
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async update(id, name, email) {
    const data = await loadData();
    const userIndex = data.users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) return null;
    
    data.users[userIndex].name = name;
    data.users[userIndex].email = email;
    
    await saveData(data);
    return await this.findById(id);
  },

  async updatePassword(id, newPassword) {
    const data = await loadData();
    const userIndex = data.users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) return;
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    data.users[userIndex].password = hashedPassword;
    
    await saveData(data);
  }
};

// Habit Model Adapter
const HabitAdapter = {
  async create(userId, habitData) {
    const data = await loadData();
    
    const newHabit = {
      id: data.habits.length > 0 ? Math.max(...data.habits.map(h => h.id)) + 1 : 1,
      user_id: parseInt(userId),
      name: habitData.name,
      description: habitData.description || null,
      category: habitData.category,
      frequency: habitData.frequency,
      goal: habitData.goal || null,
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    data.habits.push(newHabit);
    await saveData(data);
    
    return await this.findById(newHabit.id);
  },

  async findById(id) {
    const data = await loadData();
    return data.habits.find(h => h.id === parseInt(id)) || null;
  },

  async findByUserId(userId, filters = {}) {
    const data = await loadData();
    let habits = data.habits.filter(h => h.user_id === parseInt(userId));
    
    if (filters.category) {
      habits = habits.filter(h => h.category === filters.category);
    }
    
    if (filters.isActive !== undefined) {
      habits = habits.filter(h => h.is_active === filters.isActive);
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    habits.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return habits;
  },

  async update(id, habitData) {
    const data = await loadData();
    const habitIndex = data.habits.findIndex(h => h.id === parseInt(id));
    
    if (habitIndex === -1) return null;
    
    const habit = data.habits[habitIndex];
    habit.name = habitData.name;
    habit.description = habitData.description || null;
    habit.category = habitData.category;
    habit.frequency = habitData.frequency;
    habit.goal = habitData.goal || null;
    if (habitData.is_active !== undefined) {
      habit.is_active = habitData.is_active;
    }
    
    await saveData(data);
    return await this.findById(id);
  },

  async delete(id) {
    const data = await loadData();
    const habitIndex = data.habits.findIndex(h => h.id === parseInt(id));
    
    if (habitIndex === -1) return false;
    
    data.habits.splice(habitIndex, 1);
    
    // Remover também as conclusões relacionadas
    data.habit_completions = data.habit_completions.filter(
      hc => hc.habit_id !== parseInt(id)
    );
    
    await saveData(data);
    return true;
  },

  async belongsToUser(habitId, userId) {
    const habit = await this.findById(habitId);
    return habit && habit.user_id === parseInt(userId);
  },

  async checkActiveStatus(habitId) {
    const data = await loadData();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    
    const recentCompletions = data.habit_completions.filter(
      hc => hc.habit_id === parseInt(habitId) && hc.completion_date >= sevenDaysAgoStr
    );
    
    const isActive = recentCompletions.length > 0;
    
    // Atualizar status no JSON
    const habitIndex = data.habits.findIndex(h => h.id === parseInt(habitId));
    if (habitIndex !== -1) {
      data.habits[habitIndex].is_active = isActive;
      await saveData(data);
    }
    
    return isActive;
  }
};

// HabitCompletion Model Adapter
const HabitCompletionAdapter = {
  async markComplete(habitId, date = null) {
    const data = await loadData();
    const completionDate = date || new Date().toISOString().split('T')[0];
    
    // Verificar se já existe
    const existing = data.habit_completions.find(
      hc => hc.habit_id === parseInt(habitId) && hc.completion_date === completionDate
    );
    
    if (existing) {
      return existing.id;
    }
    
    const newCompletion = {
      id: data.habit_completions.length > 0 
        ? Math.max(...data.habit_completions.map(hc => hc.id)) + 1 
        : 1,
      habit_id: parseInt(habitId),
      completion_date: completionDate
    };
    
    data.habit_completions.push(newCompletion);
    await saveData(data);
    
    return newCompletion.id;
  },

  async getCompletionsByHabit(habitId, limit = null) {
    const data = await loadData();
    let completions = data.habit_completions
      .filter(hc => hc.habit_id === parseInt(habitId))
      .sort((a, b) => new Date(b.completion_date) - new Date(a.completion_date));
    
    if (limit) {
      completions = completions.slice(0, limit);
    }
    
    return completions;
  },

  async isCompletedToday(habitId) {
    const data = await loadData();
    const today = new Date().toISOString().split('T')[0];
    
    return data.habit_completions.some(
      hc => hc.habit_id === parseInt(habitId) && hc.completion_date === today
    );
  },

  async getStreak(habitId) {
    const completions = await this.getCompletionsByHabit(habitId);
    
    if (completions.length === 0) {
      return { current: 0, best: 0 };
    }

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let expectedDate = new Date(today);
    
    for (let i = 0; i < completions.length; i++) {
      const completionDate = new Date(completions[i].completion_date);
      completionDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((expectedDate - completionDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        currentStreak++;
        tempStreak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else if (diffDays === 1) {
        currentStreak++;
        tempStreak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        if (i === 0 && diffDays > 1) {
          currentStreak = 0;
        }
        break;
      }
    }

    let prevDate = null;
    tempStreak = 0;
    
    for (const completion of completions) {
      const completionDate = new Date(completion.completion_date);
      completionDate.setHours(0, 0, 0, 0);
      
      if (prevDate === null) {
        tempStreak = 1;
        prevDate = completionDate;
      } else {
        const diffDays = Math.floor((prevDate - completionDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          if (tempStreak > bestStreak) {
            bestStreak = tempStreak;
          }
          tempStreak = 1;
        }
        prevDate = completionDate;
      }
    }
    
    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
    
    return {
      current: currentStreak,
      best: bestStreak
    };
  },

  async getCompletionsByPeriod(habitId, startDate, endDate) {
    const data = await loadData();
    return data.habit_completions
      .filter(hc => {
        if (hc.habit_id !== parseInt(habitId)) return false;
        const date = hc.completion_date;
        return date >= startDate && date <= endDate;
      })
      .sort((a, b) => new Date(a.completion_date) - new Date(b.completion_date));
  },

  async getConsistencyScore(habitId, days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const completions = await this.getCompletionsByPeriod(
      habitId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    
    const totalDays = days;
    const completedDays = completions.length;
    const consistency = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
    
    return {
      totalDays,
      completedDays,
      consistency: Math.round(consistency * 100) / 100
    };
  },

  async removeCompletion(habitId, date) {
    const data = await loadData();
    const index = data.habit_completions.findIndex(
      hc => hc.habit_id === parseInt(habitId) && hc.completion_date === date
    );
    
    if (index === -1) return false;
    
    data.habit_completions.splice(index, 1);
    await saveData(data);
    
    return true;
  }
};

module.exports = {
  UserAdapter,
  HabitAdapter,
  HabitCompletionAdapter,
  loadData,
  saveData
};

