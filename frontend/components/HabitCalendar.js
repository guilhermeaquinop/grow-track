'use client';

import { useEffect, useState } from 'react';
import { habitsAPI } from '../services/api';

export default function HabitCalendar({ habitId }) {
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (habitId) {
      loadCompletions();
    }
  }, [habitId]);

  const loadCompletions = async () => {
    try {
      const response = await habitsAPI.getById(habitId);
      // Buscar histórico completo
      const historyResponse = await habitsAPI.getAll();
      const habit = historyResponse.data.data.find(h => h.id === parseInt(habitId));
      
      if (habit?.lastCompletion) {
        // Buscar mais conclusões se necessário
        // Por enquanto, vamos criar um calendário dos últimos 30 dias
        const dates = new Set();
        if (habit.lastCompletion) {
          dates.add(new Date(habit.lastCompletion.completion_date).toISOString().split('T')[0]);
        }
        setCompletions(Array.from(dates));
      }
    } catch (error) {
      console.error('Erro ao carregar calendário:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gerar últimos 30 dias
  const generateLast30Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    return days;
  };

  const days = generateLast30Days();
  const completionSet = new Set(completions);

  const getIntensity = (date) => {
    if (completionSet.has(date)) return 'bg-green-500';
    return 'bg-gray-200';
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Carregando calendário...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-xl font-bold mb-4">Calendário de Hábitos (Últimos 30 dias)</h3>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dateObj = new Date(date);
          const dayOfWeek = dateObj.getDay();
          const dayOfMonth = dateObj.getDate();
          const isCompleted = completionSet.has(date);
          
          return (
            <div
              key={date}
              className={`aspect-square rounded flex items-center justify-center text-xs ${
                isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
              title={`${dateObj.toLocaleDateString('pt-BR')} - ${isCompleted ? 'Concluído' : 'Não concluído'}`}
            >
              {dayOfMonth}
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-gray-600">Não concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600">Concluído</span>
        </div>
      </div>
    </div>
  );
}

