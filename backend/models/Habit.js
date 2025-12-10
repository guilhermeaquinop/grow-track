const { shouldUseDatabaseSync, getPool } = require('../config/database');
const { HabitAdapter } = require('../utils/jsonAdapter');

class Habit {
  // Criar novo hábito
  static async create(userId, habitData) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const { name, description, category, frequency, goal } = habitData;
      
      const [result] = await pool.execute(
        `INSERT INTO habits (user_id, name, description, category, frequency, goal) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, name, description || null, category, frequency, goal || null]
      );
      
      return await this.findById(result.insertId);
    } else {
      return await HabitAdapter.create(userId, habitData);
    }
  }

  // Buscar hábito por ID
  static async findById(id) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        'SELECT * FROM habits WHERE id = ?',
        [id]
      );
      
      return rows[0] || null;
    } else {
      return await HabitAdapter.findById(id);
    }
  }

  // Buscar hábitos do usuário
  static async findByUserId(userId, filters = {}) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      let query = 'SELECT * FROM habits WHERE user_id = ?';
      const params = [userId];

      // Filtro por categoria
      if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
      }

      // Filtro por status ativo
      if (filters.isActive !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.isActive);
      }

      query += ' ORDER BY created_at DESC';

      const [rows] = await pool.execute(query, params);
      return rows;
    } else {
      return await HabitAdapter.findByUserId(userId, filters);
    }
  }

  // Atualizar hábito
  static async update(id, habitData) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const { name, description, category, frequency, goal, is_active } = habitData;
      
      await pool.execute(
        `UPDATE habits 
         SET name = ?, description = ?, category = ?, frequency = ?, goal = ?, is_active = ?
         WHERE id = ?`,
        [name, description || null, category, frequency, goal || null, is_active !== undefined ? is_active : true, id]
      );
      
      return await this.findById(id);
    } else {
      return await HabitAdapter.update(id, habitData);
    }
  }

  // Excluir hábito
  static async delete(id) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const [result] = await pool.execute(
        'DELETE FROM habits WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } else {
      return await HabitAdapter.delete(id);
    }
  }

  // Verificar se o hábito pertence ao usuário
  static async belongsToUser(habitId, userId) {
    const habit = await this.findById(habitId);
    return habit && habit.user_id === userId;
  }

  // Verificar se hábito está ativo (RN04: pelo menos uma conclusão nos últimos 7 dias)
  static async checkActiveStatus(habitId) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM habit_completions 
         WHERE habit_id = ? 
         AND completion_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
        [habitId]
      );
      
      const isActive = rows[0].count > 0;
      
      // Atualizar status no banco
      await pool.execute(
        'UPDATE habits SET is_active = ? WHERE id = ?',
        [isActive, habitId]
      );
      
      return isActive;
    } else {
      return await HabitAdapter.checkActiveStatus(habitId);
    }
  }
}

module.exports = Habit;

