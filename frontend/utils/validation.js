// Utilitários de validação

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
  }
  return { valid: true };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return { valid: false, message: 'O nome deve ter pelo menos 2 caracteres' };
  }
  return { valid: true };
};

export const validateHabitName = (name) => {
  if (!name || name.trim().length < 2) {
    return { valid: false, message: 'O nome do hábito deve ter pelo menos 2 caracteres' };
  }
  if (name.length > 50) {
    return { valid: false, message: 'O nome do hábito deve ter no máximo 50 caracteres' };
  }
  return { valid: true };
};

export const validateHabitDescription = (description) => {
  if (description && description.length > 200) {
    return { valid: false, message: 'A descrição deve ter no máximo 200 caracteres' };
  }
  return { valid: true };
};

export const formatErrorMessage = (error) => {
  if (error.response) {
    // Erro da API
    return error.response.data?.message || 'Erro ao processar solicitação';
  } else if (error.request) {
    // Erro de rede
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  } else {
    // Outro erro
    return error.message || 'Ocorreu um erro inesperado';
  }
};

