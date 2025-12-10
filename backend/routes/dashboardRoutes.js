const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/dashboard - Dados do dashboard (RF05)
router.get('/', dashboardController.getDashboardData);

// GET /api/dashboard/consistency - Pontuação de consistência (RF07)
router.get('/consistency', dashboardController.getConsistencyScore);

// GET /api/dashboard/history - Histórico completo (RF10)
router.get('/history', dashboardController.getHistory);

module.exports = router;

