const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GrowTrack API está funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rota para verificar status do banco de dados
app.get('/api/status', async (req, res) => {
  try {
    const { shouldUseDatabaseSync } = require('./config/database');
    const isUsingDatabase = shouldUseDatabaseSync();
    
    res.json({
      success: true,
      data: {
        usingDatabase: isUsingDatabase,
        mode: isUsingDatabase ? 'database' : 'json',
        message: isUsingDatabase 
          ? 'Conectado ao banco de dados MySQL' 
          : 'Usando armazenamento JSON local'
      }
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        usingDatabase: false,
        mode: 'json',
        message: 'Usando armazenamento JSON local'
      }
    });
  }
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

