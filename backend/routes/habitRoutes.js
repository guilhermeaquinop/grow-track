const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');
const { authenticateToken, authorizeUser } = require('../middleware/authMiddleware');
const { validateHabit } = require('../middleware/validationMiddleware');

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/habits - Listar hábitos (RF09: filtro por categoria)
router.get('/', habitController.getHabits);

// GET /api/habits/:id - Buscar hábito por ID
router.get('/:id', authorizeUser, habitController.getHabitById);

// POST /api/habits - Criar hábito (RF03)
router.post('/', validateHabit, habitController.createHabit);

// PUT /api/habits/:id - Editar hábito (RF08)
router.put('/:id', authorizeUser, validateHabit, habitController.updateHabit);

// DELETE /api/habits/:id - Excluir hábito (RF08)
router.delete('/:id', authorizeUser, habitController.deleteHabit);

// POST /api/habits/:id/complete - Marcar como concluído (RF04)
router.post('/:id/complete', authorizeUser, habitController.markHabitComplete);

module.exports = router;

