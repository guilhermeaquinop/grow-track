// Validação de registro
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email inválido');
  }

  if (!password || password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors
    });
  }

  next();
};

// Validação de login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email é obrigatório');
  }

  if (!password) {
    errors.push('Senha é obrigatória');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors
    });
  }

  next();
};

// Validação de criação/edição de hábito
const validateHabit = (req, res, next) => {
  const { name, category, frequency } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Nome do hábito deve ter pelo menos 2 caracteres');
  }

  const validCategories = ['saude', 'produtividade', 'financeiro', 'pessoal', 'estudos', 'social', 'criatividade'];
  if (!category || !validCategories.includes(category)) {
    errors.push('Categoria inválida');
  }

  const validFrequencies = ['diario', 'semanal', 'mensal'];
  if (!frequency || !validFrequencies.includes(frequency)) {
    errors.push('Frequência inválida');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateHabit
};

