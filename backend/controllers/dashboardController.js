const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');

// RF05: Dados do dashboard
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar todos os hábitos do usuário
    const habits = await Habit.findByUserId(userId);

    // Estatísticas gerais
    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.is_active).length;

    // Calcular streaks e consistência para cada hábito
    const habitsWithStats = await Promise.all(
      habits.map(async (habit) => {
        const streak = await HabitCompletion.getStreak(habit.id);
        const isCompletedToday = await HabitCompletion.isCompletedToday(habit.id);
        const consistency = await HabitCompletion.getConsistencyScore(habit.id, 30);
        
        return {
          ...habit,
          streak: streak.current,
          bestStreak: streak.best,
          isCompletedToday,
          consistency: consistency.consistency
        };
      })
    );

    // Calcular melhor streak geral
    const bestStreak = habitsWithStats.reduce((max, habit) => 
      Math.max(max, habit.bestStreak), 0
    );

    // Calcular streak atual geral (soma de todos os streaks)
    const currentStreak = habitsWithStats.reduce((sum, habit) => 
      sum + habit.streak, 0
    );

    // Calcular taxa de sucesso geral (últimos 30 dias)
    let totalConsistency = 0;
    let habitsWithConsistency = 0;
    
    habitsWithStats.forEach(habit => {
      if (habit.consistency !== undefined) {
        totalConsistency += habit.consistency;
        habitsWithConsistency++;
      }
    });

    const overallSuccessRate = habitsWithConsistency > 0 
      ? Math.round((totalConsistency / habitsWithConsistency) * 100) / 100 
      : 0;

    // Calcular pontos totais (baseado em conclusões)
    let totalPoints = 0;
    for (const habit of habits) {
      const completions = await HabitCompletion.getCompletionsByHabit(habit.id);
      totalPoints += completions.length;
    }

    // Dados dos últimos 7 dias para gráfico
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let dayCompletions = 0;
      for (const habit of habits) {
        const completions = await HabitCompletion.getCompletionsByHabit(habit.id);
        const hasCompletion = completions.some(c => {
          // completion_date pode ser string (JSON) ou Date (MySQL)
          const completionDate = c.completion_date instanceof Date 
            ? c.completion_date.toISOString().split('T')[0]
            : c.completion_date;
          return completionDate === dateStr;
        });
        if (hasCompletion) dayCompletions++;
      }
      
      last7Days.push({
        date: dateStr,
        dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        completions: dayCompletions,
        totalHabits: totalHabits
      });
    }

    // Hábitos de hoje
    const todayHabits = habitsWithStats.map(habit => ({
      id: habit.id,
      name: habit.name,
      category: habit.category,
      goal: habit.goal,
      isCompletedToday: habit.isCompletedToday,
      streak: habit.streak
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalHabits,
          activeHabits,
          currentStreak,
          bestStreak,
          successRate: overallSuccessRate,
          totalPoints
        },
        last7Days,
        todayHabits
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do dashboard'
    });
  }
};

// RF07: Pontuação de consistência
const getConsistencyScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const habits = await Habit.findByUserId(userId);

    const consistencyScores = await Promise.all(
      habits.map(async (habit) => {
        const consistency = await HabitCompletion.getConsistencyScore(habit.id, 30);
        const streak = await HabitCompletion.getStreak(habit.id);
        
        return {
          habitId: habit.id,
          habitName: habit.name,
          consistency: consistency.consistency,
          completedDays: consistency.completedDays,
          totalDays: consistency.totalDays,
          currentStreak: streak.current,
          bestStreak: streak.best
        };
      })
    );

    res.json({
      success: true,
      data: consistencyScores
    });
  } catch (error) {
    console.error('Erro ao calcular pontuação de consistência:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao calcular pontuação de consistência'
    });
  }
};

// RF10: Histórico completo
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { habitId, startDate, endDate } = req.query;

    if (habitId) {
      // Histórico de um hábito específico
      const habit = await Habit.findById(parseInt(habitId));
      
      if (!habit || habit.user_id !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Hábito não encontrado'
        });
      }

      let completions;
      if (startDate && endDate) {
        completions = await HabitCompletion.getCompletionsByPeriod(
          parseInt(habitId),
          startDate,
          endDate
        );
      } else {
        completions = await HabitCompletion.getCompletionsByHabit(parseInt(habitId));
      }

      res.json({
        success: true,
        data: {
          habit: {
            id: habit.id,
            name: habit.name,
            category: habit.category
          },
          completions
        }
      });
    } else {
      // Histórico de todos os hábitos
      const habits = await Habit.findByUserId(userId);
      
      const history = await Promise.all(
        habits.map(async (habit) => {
          const completions = await HabitCompletion.getCompletionsByHabit(habit.id);
          return {
            habit: {
              id: habit.id,
              name: habit.name,
              category: habit.category
            },
            completions
          };
        })
      );

      res.json({
        success: true,
        data: history
      });
    }
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico'
    });
  }
};

module.exports = {
  getDashboardData,
  getConsistencyScore,
  getHistory
};

