const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para autenticar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido'
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'growtrack-secret-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Verificar se o usuário ainda existe
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar se o recurso pertence ao usuário (RN01)
const authorizeUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Habit = require('../models/Habit');
    
    const belongsToUser = await Habit.belongsToUser(parseInt(id), req.user.id);
    
    if (!belongsToUser) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para acessar este recurso'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar autorização'
    });
  }
};

module.exports = {
  authenticateToken,
  authorizeUser
};

