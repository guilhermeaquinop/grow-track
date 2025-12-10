const { shouldUseDatabaseSync, getPool } = require('../config/database');
const { HabitCompletionAdapter } = require('../utils/jsonAdapter');

class HabitCompletion {
  // Marcar hábito como concluído (RN03: um registro por dia por hábito)
  static async markComplete(habitId, date = null) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const completionDate = date || new Date().toISOString().split('T')[0];
      
      try {
        const [result] = await pool.execute(
          'INSERT INTO habit_completions (habit_id, completion_date) VALUES (?, ?)',
          [habitId, completionDate]
        );
        
        return result.insertId;
      } catch (error) {
        // Se já existe registro para este dia, retornar o ID existente
        if (error.code === 'ER_DUP_ENTRY') {
          const [rows] = await pool.execute(
            'SELECT id FROM habit_completions WHERE habit_id = ? AND completion_date = ?',
            [habitId, completionDate]
          );
          return rows[0]?.id || null;
        }
        throw error;
      }
    } else {
      return await HabitCompletionAdapter.markComplete(habitId, date);
    }
  }

  // Buscar conclusões de um hábito
  static async getCompletionsByHabit(habitId, limit = null) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      let query = `
        SELECT * FROM habit_completions 
        WHERE habit_id = ? 
        ORDER BY completion_date DESC
      `;
      
      const params = [habitId];
      
      if (limit) {
        query += ' LIMIT ?';
        params.push(limit);
      }
      
      const [rows] = await pool.execute(query, params);
      return rows;
    } else {
      return await HabitCompletionAdapter.getCompletionsByHabit(habitId, limit);
    }
  }

  // Verificar se hábito foi concluído hoje
  static async isCompletedToday(habitId) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        'SELECT id FROM habit_completions WHERE habit_id = ? AND completion_date = CURDATE()',
        [habitId]
      );
      
      return rows.length > 0;
    } else {
      return await HabitCompletionAdapter.isCompletedToday(habitId);
    }
  }

  // Calcular streak (sequência de dias consecutivos) - RN02
  static async getStreak(habitId) {
    if (shouldUseDatabaseSync()) {
      // Buscar todas as conclusões ordenadas por data (mais recente primeiro)
      const completions = await this.getCompletionsByHabit(habitId);
      
      if (completions.length === 0) {
        return { current: 0, best: 0 };
      }

      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;
      
      // Converter datas para objetos Date para comparação
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Verificar streak atual (começando de hoje)
      let expectedDate = new Date(today);
      
      for (let i = 0; i < completions.length; i++) {
        const completionDate = new Date(completions[i].completion_date);
        completionDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((expectedDate - completionDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          // Data esperada encontrada
          currentStreak++;
          tempStreak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else if (diffDays === 1) {
          // Pulou um dia, streak continua
          currentStreak++;
          tempStreak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
          // Streak quebrado
          if (i === 0 && diffDays > 1) {
            // Se o primeiro registro não é de hoje ou ontem, não há streak atual
            currentStreak = 0;
          }
          break;
        }
      }

      // Calcular melhor streak histórico
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
            // Consecutivo
            tempStreak++;
          } else {
            // Streak quebrado, verificar se é o melhor
            if (tempStreak > bestStreak) {
              bestStreak = tempStreak;
            }
            tempStreak = 1;
          }
          prevDate = completionDate;
        }
      }
      
      // Verificar último streak
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
      
      return {
        current: currentStreak,
        best: bestStreak
      };
    } else {
      return await HabitCompletionAdapter.getStreak(habitId);
    }
  }

  // Buscar conclusões por período
  static async getCompletionsByPeriod(habitId, startDate, endDate) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        `SELECT * FROM habit_completions 
         WHERE habit_id = ? 
         AND completion_date BETWEEN ? AND ?
         ORDER BY completion_date ASC`,
        [habitId, startDate, endDate]
      );
      
      return rows;
    } else {
      return await HabitCompletionAdapter.getCompletionsByPeriod(habitId, startDate, endDate);
    }
  }

  // Calcular taxa de consistência (últimos 30 dias)
  static async getConsistencyScore(habitId, days = 30) {
    if (shouldUseDatabaseSync()) {
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
    } else {
      return await HabitCompletionAdapter.getConsistencyScore(habitId, days);
    }
  }

  // Remover conclusão (desmarcar)
  static async removeCompletion(habitId, date) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const [result] = await pool.execute(
        'DELETE FROM habit_completions WHERE habit_id = ? AND completion_date = ?',
        [habitId, date]
      );
      
      return result.affectedRows > 0;
    } else {
      return await HabitCompletionAdapter.removeCompletion(habitId, date);
    }
  }
}

module.exports = HabitCompletion;

