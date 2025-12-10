'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HabitReminder from '../../components/HabitReminder';
import ConsistencyScore from '../../components/ConsistencyScore';
import { LineChart, PieChart } from '../../components/ProgressChart';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI, habitsAPI } from '../../services/api';
import { useNotification } from '../../components/NotificationProvider';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const [dashboardData, setDashboardData] = useState(null);
  const [consistencyData, setConsistencyData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadDashboardData();
      loadConsistencyData();
      loadCategoryData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      const response = await dashboardAPI.getData();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      showError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadConsistencyData = async () => {
    try {
      const response = await dashboardAPI.getConsistency();
      setConsistencyData(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar consistência:', error);
    }
  };

  const loadCategoryData = async () => {
    try {
      const response = await habitsAPI.getAll();
      const habits = response.data.data;
      
      // Contar hábitos por categoria
      const categoryCount = {};
      habits.forEach(habit => {
        categoryCount[habit.category] = (categoryCount[habit.category] || 0) + 1;
      });

      const categoryLabels = {
        saude: 'Saúde',
        produtividade: 'Produtividade',
        financeiro: 'Financeiro',
        pessoal: 'Pessoal',
        estudos: 'Estudos',
        social: 'Social',
        criatividade: 'Criatividade',
      };

      const colors = [
        '#2F80ED', '#10B981', '#F59E0B', '#EF4444',
        '#8B5CF6', '#EC4899', '#06B6D4'
      ];

      setCategoryData({
        labels: Object.keys(categoryCount).map(cat => categoryLabels[cat] || cat),
        datasets: [{
          label: 'Hábitos por Categoria',
          data: Object.values(categoryCount),
          backgroundColor: colors.slice(0, Object.keys(categoryCount).length),
        }],
      });
    } catch (error) {
      console.error('Erro ao carregar dados de categoria:', error);
    }
  };

  const handleMarkComplete = async (habitId) => {
    try {
      await habitsAPI.markComplete(habitId);
      showSuccess('Hábito marcado como concluído! 🎉');
      loadDashboardData(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao marcar hábito como concluído:', error);
      showError(error.response?.data?.message || 'Erro ao marcar hábito como concluído');
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </main>
      </>
    );
  }

  if (!dashboardData) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Erro ao carregar dados do dashboard</p>
          </div>
        </main>
      </>
    );
  }

  // Dados para gráfico de linha (progresso ao longo do tempo)
  const lineChartData = {
    labels: dashboardData.last7Days.map(day => day.dayName),
    datasets: [
      {
        label: 'Hábitos Concluídos',
        data: dashboardData.last7Days.map(day => day.completions),
        borderColor: '#2F80ED',
        backgroundColor: 'rgba(47, 128, 237, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Dados para gráfico de barras (já existente)
  const barChartData = {
    labels: dashboardData.last7Days.map(day => day.dayName),
    datasets: [
      {
        label: 'Hábitos Concluídos',
        data: dashboardData.last7Days.map(day => day.completions),
        backgroundColor: '#2F80ED',
      },
    ],
  };

  // Calcular consistência média
  const avgConsistency = consistencyData && consistencyData.length > 0
    ? consistencyData.reduce((sum, item) => sum + item.consistency, 0) / consistencyData.length
    : 0;

  // Calcular melhor streak
  const bestStreak = dashboardData.stats.bestStreak || 0;
  const currentStreak = dashboardData.stats.currentStreak || 0;

  return (
    <>
      <Header />
      <HabitReminder />
      <main className="min-h-screen py-8">
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-12">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">
              Olá, {user?.name || 'Usuário'}! 👋
            </h1>
            <p className="text-lg opacity-90">Vamos manter o foco nos seus objetivos de hoje</p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-100">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold">{dashboardData.stats.totalHabits}</div>
                <div className="text-gray-600 text-sm">Hábitos ativos</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-100">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-2xl font-bold">{currentStreak}</div>
                <div className="text-gray-600 text-sm">Dias de streak</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-100">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold">{dashboardData.stats.successRate.toFixed(1)}%</div>
                <div className="text-gray-600 text-sm">Taxa de sucesso</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-100">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold">{dashboardData.stats.totalPoints}</div>
                <div className="text-gray-600 text-sm">Pontos totais</div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Gráfico de Linha - Progresso ao longo do tempo */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <LineChart 
                  data={lineChartData} 
                  title="Progresso dos últimos 7 dias"
                />
              </div>

              {/* Gráfico de Pizza - Distribuição por categoria */}
              {categoryData && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <PieChart 
                    data={categoryData} 
                    title="Hábitos por Categoria"
                  />
                </div>
              )}
            </div>

            {/* Consistency Score */}
            <div className="mb-8">
              <ConsistencyScore
                consistency={avgConsistency}
                streak={currentStreak}
                bestStreak={bestStreak}
              />
            </div>

            {/* Today's Habits Section */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Hábitos de hoje</h2>
                <Link
                  href="/habits"
                  className="text-primary hover:underline text-sm"
                >
                  Ver todos
                </Link>
              </div>

              {dashboardData.todayHabits.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Nenhum hábito cadastrado ainda.</p>
                  <Link
                    href="/habits/new"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition inline-block"
                  >
                    + Novo hábito
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {dashboardData.todayHabits.map((habit) => (
                    <div
                      key={habit.id}
                      className={`p-5 rounded-lg border-2 transition ${
                        habit.isCompletedToday
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-primary'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{habit.name}</h3>
                          {habit.goal && (
                            <p className="text-sm text-gray-600">{habit.goal}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          habit.isCompletedToday
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {habit.isCompletedToday ? 'Concluído' : 'Pendente'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Streak: {habit.streak} dias
                        </span>
                        {!habit.isCompletedToday && (
                          <button
                            onClick={() => handleMarkComplete(habit.id)}
                            className="bg-primary text-white px-4 py-1 rounded text-sm hover:bg-blue-600 transition"
                          >
                            Marcar como feito
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/habits/new"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition inline-block"
                >
                  + Novo hábito
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
