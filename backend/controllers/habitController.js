const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');

// RF03: Criar hábito
const createHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const habitData = req.body;

    const habit = await Habit.create(userId, habitData);

    res.status(201).json({
      success: true,
      message: 'Hábito criado com sucesso',
      data: habit
    });
  } catch (error) {
    console.error('Erro ao criar hábito:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar hábito'
    });
  }
};

// Listar hábitos do usuário (RF09: com filtro por categoria)
const getHabits = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, isActive } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    const habits = await Habit.findByUserId(userId, filters);

    // Adicionar informações de streak e última conclusão
    const habitsWithStats = await Promise.all(
      habits.map(async (habit) => {
        const streak = await HabitCompletion.getStreak(habit.id);
        const isCompletedToday = await HabitCompletion.isCompletedToday(habit.id);
        const lastCompletion = await HabitCompletion.getCompletionsByHabit(habit.id, 1);
        
        return {
          ...habit,
          streak: streak.current,
          bestStreak: streak.best,
          isCompletedToday,
          lastCompletion: lastCompletion[0] || null
        };
      })
    );

    res.json({
      success: true,
      data: habitsWithStats
    });
  } catch (error) {
    console.error('Erro ao listar hábitos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar hábitos'
    });
  }
};

// RF08: Editar hábito
const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const habitData = req.body;

    const habit = await Habit.update(parseInt(id), habitData);

    res.json({
      success: true,
      message: 'Hábito atualizado com sucesso',
      data: habit
    });
  } catch (error) {
    console.error('Erro ao atualizar hábito:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar hábito'
    });
  }
};

// RF08: Excluir hábito
const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Habit.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Hábito não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Hábito excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir hábito:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir hábito'
    });
  }
};

// RF04: Marcar hábito como concluído (RN03: um registro por dia)
const markHabitComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    // Verificar se já foi concluído hoje
    const completionDate = date || new Date().toISOString().split('T')[0];
    const isCompleted = await HabitCompletion.isCompletedToday(parseInt(id));
    
    if (isCompleted && !date) {
      return res.status(400).json({
        success: false,
        message: 'Este hábito já foi marcado como concluído hoje'
      });
    }

    const completionId = await HabitCompletion.markComplete(parseInt(id), completionDate);

    // Atualizar status ativo do hábito (RN04)
    await Habit.checkActiveStatus(parseInt(id));

    // Calcular novo streak
    const streak = await HabitCompletion.getStreak(parseInt(id));

    res.json({
      success: true,
      message: 'Hábito marcado como concluído',
      data: {
        completionId,
        streak: streak.current,
        bestStreak: streak.best
      }
    });
  } catch (error) {
    console.error('Erro ao marcar hábito como concluído:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao marcar hábito como concluído'
    });
  }
};

// Buscar hábito por ID
const getHabitById = async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await Habit.findById(parseInt(id));

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Hábito não encontrado'
      });
    }

    // Adicionar estatísticas
    const streak = await HabitCompletion.getStreak(habit.id);
    const isCompletedToday = await HabitCompletion.isCompletedToday(habit.id);
    const consistency = await HabitCompletion.getConsistencyScore(habit.id);

    res.json({
      success: true,
      data: {
        ...habit,
        streak: streak.current,
        bestStreak: streak.best,
        isCompletedToday,
        consistency
      }
    });
  } catch (error) {
    console.error('Erro ao buscar hábito:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar hábito'
    });
  }
};

module.exports = {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  markHabitComplete,
  getHabitById
};

