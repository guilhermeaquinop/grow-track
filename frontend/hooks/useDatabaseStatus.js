'use client';

import { useState, useEffect } from 'react';

export function useDatabaseStatus() {
  const [isUsingDatabase, setIsUsingDatabase] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/status`);
        const data = await response.json();
        
        if (data.success) {
          setIsUsingDatabase(data.data.usingDatabase);
        }
      } catch (error) {
        // Se houver erro, assumir que está usando JSON
        setIsUsingDatabase(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { isUsingDatabase, isLoading };
}

