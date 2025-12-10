const mysql = require('mysql2/promise');
require('dotenv').config();

// Flag global para indicar se está usando banco ou JSON
let useDatabase = false;
let pool = null;
let connectionTested = false;

// Função para testar conexão
async function testConnection() {
  if (connectionTested) {
    return useDatabase;
  }
  
  connectionTested = true;
  
  // Se não houver configuração de banco, usar JSON
  if (!process.env.DB_HOST && !process.env.DB_USER) {
    console.log('📄 Nenhuma configuração de banco encontrada. Usando modo JSON.');
    useDatabase = false;
    return false;
  }

  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'growtrack',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });

    // Testar conexão
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao banco de dados MySQL');
    useDatabase = true;
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️  Erro ao conectar ao banco de dados:', error.message);
    console.log('📄 Usando modo JSON para armazenamento local');
    useDatabase = false;
    pool = null;
    return false;
  }
}

// Inicializar teste de conexão
testConnection().catch(() => {
  useDatabase = false;
  pool = null;
});

// Função para verificar se deve usar banco de dados
async function shouldUseDatabase() {
  if (!connectionTested) {
    await testConnection();
  }
  return useDatabase && pool !== null;
}

// Versão síncrona (para compatibilidade, mas pode retornar false inicialmente)
function shouldUseDatabaseSync() {
  return useDatabase && pool !== null;
}

// Função para obter o pool (retorna null se não disponível)
function getPool() {
  return shouldUseDatabaseSync() ? pool : null;
}

// Função para forçar modo JSON (útil para testes)
function forceJsonMode() {
  useDatabase = false;
  console.log('📄 Modo JSON forçado');
}

module.exports = {
  pool,
  shouldUseDatabase,
  shouldUseDatabaseSync,
  getPool,
  forceJsonMode,
  useDatabase: () => useDatabase,
  testConnection
};

