'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { habitsAPI } from '../services/api';
import { useNotification } from './NotificationProvider';

export default function HabitReminder() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const { showWarning, showInfo } = useNotification();

  useEffect(() => {
    if (user) {
      loadReminders();
      // Verificar lembretes a cada hora
      const interval = setInterval(loadReminders, 3600000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadReminders = async () => {
    try {
      const response = await habitsAPI.getAll();
      const habits = response.data.data;
      
      const todayHabits = habits.filter(h => !h.isCompletedToday && h.is_active);
      const inactiveHabits = [];

      // Verificar hábitos inativos há mais de 3 dias (RN05)
      for (const habit of habits) {
        if (habit.lastCompletion) {
          const lastDate = new Date(habit.lastCompletion.completion_date);
          const today = new Date();
          const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
          
          if (diffDays > 3 && habit.is_active) {
            inactiveHabits.push({ habit, days: diffDays });
          }
        } else if (habit.is_active) {
          // Hábito nunca foi concluído
          const createdDate = new Date(habit.created_at);
          const today = new Date();
          const diffDays = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
          
          if (diffDays > 3) {
            inactiveHabits.push({ habit, days: diffDays });
          }
        }
      }

      // Mostrar notificações
      if (todayHabits.length > 0) {
        showWarning(
          `Você tem ${todayHabits.length} hábito${todayHabits.length > 1 ? 's' : ''} pendente${todayHabits.length > 1 ? 's' : ''} para hoje!`,
          8000
        );
      }

      if (inactiveHabits.length > 0) {
        inactiveHabits.forEach(({ habit, days }) => {
          showInfo(
            `O hábito "${habit.name}" está inativo há ${days} dias. Que tal retomar?`,
            10000
          );
        });
      }

      setReminders([...todayHabits, ...inactiveHabits.map(i => i.habit)]);
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
    }
  };

  return null; // Componente apenas para lógica, não renderiza nada
}

