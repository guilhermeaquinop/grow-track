const { shouldUseDatabaseSync, getPool } = require('../config/database');
const { UserAdapter } = require('../utils/jsonAdapter');
const bcrypt = require('bcrypt');

class User {
  // Criar novo usuário
  static async create(name, email, password) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );
      
      return result.insertId;
    } else {
      return await UserAdapter.create(name, email, password);
    }
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      return rows[0] || null;
    } else {
      return await UserAdapter.findByEmail(email);
    }
  }

  // Buscar usuário por ID
  static async findById(id) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const [rows] = await pool.execute(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        [id]
      );
      
      return rows[0] || null;
    } else {
      return await UserAdapter.findById(id);
    }
  }

  // Verificar senha
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Atualizar perfil do usuário
  static async update(id, name, email) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      await pool.execute(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id]
      );
      
      return await this.findById(id);
    } else {
      return await UserAdapter.update(id, name, email);
    }
  }

  // Atualizar senha
  static async updatePassword(id, newPassword) {
    if (shouldUseDatabaseSync()) {
      const pool = getPool();
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
    } else {
      return await UserAdapter.updatePassword(id, newPassword);
    }
  }
}

module.exports = User;

