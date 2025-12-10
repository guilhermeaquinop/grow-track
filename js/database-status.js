/**
 * Script para verificar e exibir o status do banco de dados
 * Adiciona um indicador visual no header quando está usando JSON
 */

(function() {
  'use strict';

  // Tentar obter a URL da API do ambiente ou usar padrão
  const API_URL = window.API_URL || 'http://localhost:5000';
  let statusCheckInterval = null;

  // Função para criar o indicador
  function createStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'db-status-indicator';
    indicator.className = 'db-status-indicator';
    indicator.innerHTML = `
      <span class="db-status-icon">📄</span>
      <span class="db-status-text">Modo JSON</span>
    `;
    indicator.title = 'Aplicação está usando armazenamento JSON local (modo de teste)';
    return indicator;
  }

  // Função para verificar o status
  async function checkDatabaseStatus() {
    try {
      const response = await fetch(`${API_URL}/api/status`);
      const data = await response.json();
      
      const indicator = document.getElementById('db-status-indicator');
      const headerContent = document.querySelector('.header__content');
      
      if (data.success && !data.data.usingDatabase) {
        // Está usando JSON - mostrar indicador
        if (!indicator && headerContent) {
          const newIndicator = createStatusIndicator();
          // Inserir antes do nav
          const nav = headerContent.querySelector('.nav');
          if (nav) {
            headerContent.insertBefore(newIndicator, nav);
          } else {
            headerContent.appendChild(newIndicator);
          }
        } else if (indicator) {
          indicator.style.display = 'flex';
        }
      } else {
        // Está usando banco - esconder indicador
        if (indicator) {
          indicator.style.display = 'none';
        }
      }
    } catch (error) {
      // Se houver erro ao conectar, assumir que está usando JSON
      const indicator = document.getElementById('db-status-indicator');
      const headerContent = document.querySelector('.header__content');
      
      if (!indicator && headerContent) {
        const newIndicator = createStatusIndicator();
        const nav = headerContent.querySelector('.nav');
        if (nav) {
          headerContent.insertBefore(newIndicator, nav);
        } else {
          headerContent.appendChild(newIndicator);
        }
      } else if (indicator) {
        indicator.style.display = 'flex';
      }
    }
  }

  // Inicializar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      checkDatabaseStatus();
      // Verificar status a cada 30 segundos
      statusCheckInterval = setInterval(checkDatabaseStatus, 30000);
    });
  } else {
    checkDatabaseStatus();
    statusCheckInterval = setInterval(checkDatabaseStatus, 30000);
  }

  // Limpar intervalo quando a página for descarregada
  window.addEventListener('beforeunload', function() {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
    }
  });
})();

