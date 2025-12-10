'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { habitsAPI } from '../../services/api';

export default function HabitsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    isActive: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadHabits();
    }
  }, [user, authLoading, filters]);

  const loadHabits = async () => {
    try {
      const response = await habitsAPI.getAll(filters);
      setHabits(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este hábito? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await habitsAPI.delete(id);
      loadHabits();
    } catch (error) {
      console.error('Erro ao excluir hábito:', error);
      alert('Erro ao excluir hábito');
    }
  };

  const categoryLabels = {
    saude: 'Saúde',
    produtividade: 'Produtividade',
    financeiro: 'Financeiro',
    pessoal: 'Pessoal',
    estudos: 'Estudos',
    social: 'Social',
    criatividade: 'Criatividade',
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-8">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-12">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">Meus Hábitos</h1>
            <p className="text-lg opacity-90">Gerencie todos os seus hábitos e acompanhe seu progresso</p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-6 bg-white border-b">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4">
                <div>
                  <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria:
                  </label>
                  <select
                    id="category-filter"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Todas as categorias</option>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status:
                  </label>
                  <select
                    id="status-filter"
                    value={filters.isActive}
                    onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Todos os status</option>
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </div>
              </div>
              <Link
                href="/habits/new"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                + Novo hábito
              </Link>
            </div>
          </div>
        </section>

        {/* Habits List */}
        <section className="py-8">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            {habits.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-md text-center border border-gray-100">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-600 mb-6">Nenhum hábito cadastrado ainda.</p>
                <Link
                  href="/habits/new"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition inline-block"
                >
                  Criar primeiro hábito
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hábito</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequência</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Streak</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {habits.map((habit) => (
                        <tr key={habit.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {habit.category === 'saude' && '💧'}
                                {habit.category === 'produtividade' && '⚡'}
                                {habit.category === 'financeiro' && '💰'}
                                {habit.category === 'pessoal' && '👤'}
                                {habit.category === 'estudos' && '📚'}
                                {habit.category === 'social' && '👥'}
                                {habit.category === 'criatividade' && '🎨'}
                              </span>
                              <div>
                                <div className="font-medium">{habit.name}</div>
                                {habit.description && (
                                  <div className="text-sm text-gray-500">{habit.description}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                              {categoryLabels[habit.category] || habit.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {habit.frequency === 'diario' && 'Diário'}
                            {habit.frequency === 'semanal' && 'Semanal'}
                            {habit.frequency === 'mensal' && 'Mensal'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">{habit.streak || 0}</span>
                              <span className="text-sm text-gray-500">dias</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded ${
                              habit.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {habit.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Link
                                href={`/habits/${habit.id}`}
                                className="text-primary hover:underline text-sm"
                              >
                                Editar
                              </Link>
                              <button
                                onClick={() => handleDelete(habit.id)}
                                className="text-red-600 hover:underline text-sm"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

