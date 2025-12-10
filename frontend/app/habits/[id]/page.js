'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import HabitCalendar from '../../../../components/HabitCalendar';
import ConsistencyScore from '../../../../components/ConsistencyScore';
import { useAuth } from '../../../../context/AuthContext';
import { habitsAPI } from '../../../../services/api';
import { useNotification } from '../../../../components/NotificationProvider';

export default function HabitDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const habitId = params.id;
  const { showSuccess, showError } = useNotification();
  
  const [habit, setHabit] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && habitId) {
      loadHabit();
    }
  }, [user, authLoading, habitId]);

  const loadHabit = async () => {
    try {
      setLoading(true);
      const response = await habitsAPI.getById(habitId);
      const habitData = response.data.data;
      setHabit(habitData);
      setFormData({
        name: habitData.name,
        description: habitData.description || '',
        category: habitData.category,
        frequency: habitData.frequency,
        goal: habitData.goal || '',
        is_active: habitData.is_active,
      });
      
      // Carregar histórico
      const historyResponse = await habitsAPI.getAll();
      const habitHistory = historyResponse.data.data.find(h => h.id === parseInt(habitId));
      if (habitHistory?.lastCompletion) {
        setCompletions([habitHistory.lastCompletion]);
      }
    } catch (error) {
      console.error('Erro ao carregar hábito:', error);
      showError('Erro ao carregar hábito');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    
    if (!formData.frequency) {
      newErrors.frequency = 'Frequência é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Por favor, corrija os erros no formulário');
      return;
    }

    try {
      await habitsAPI.update(habitId, formData);
      setEditing(false);
      setErrors({});
      showSuccess('Hábito atualizado com sucesso!');
      loadHabit();
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error);
      showError(error.response?.data?.message || 'Erro ao atualizar hábito');
    }
  };

  const handleMarkComplete = async () => {
    try {
      await habitsAPI.markComplete(habitId);
      showSuccess('Hábito marcado como concluído! 🎉');
      loadHabit();
    } catch (error) {
      console.error('Erro ao marcar como concluído:', error);
      showError(error.response?.data?.message || 'Erro ao marcar hábito como concluído');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este hábito? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await habitsAPI.delete(habitId);
      showSuccess('Hábito excluído com sucesso');
      router.push('/habits');
    } catch (error) {
      console.error('Erro ao excluir hábito:', error);
      showError('Erro ao excluir hábito');
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

  if (!habit) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Hábito não encontrado</p>
            <Link href="/habits" className="text-primary hover:underline mt-4 inline-block">
              Voltar para lista de hábitos
            </Link>
          </div>
        </main>
      </>
    );
  }

  const categoryLabels = {
    saude: 'Saúde',
    produtividade: 'Produtividade',
    financeiro: 'Financeiro',
    pessoal: 'Pessoal',
    estudos: 'Estudos',
    social: 'Social',
    criatividade: 'Criatividade',
  };

  return (
    <>
      <Header />
      <main className="min-h-screen py-8">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-12">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm mb-4">
              <Link href="/habits" className="opacity-80 hover:opacity-100">
                Meus Hábitos
              </Link>
              <span>/</span>
              <span>{habit.name}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{habit.name}</h1>
            {habit.description && (
              <p className="text-lg opacity-90">{habit.description}</p>
            )}
          </div>
        </section>

        {/* Content Section */}
        <section className="py-8">
          <div className="container-custom max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Informações do hábito */}
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Informações do hábito</h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(!editing);
                        setErrors({});
                      }}
                      className="text-primary hover:underline text-sm"
                    >
                      {editing ? 'Cancelar' : 'Editar'}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                {editing ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        className={`w-full px-4 py-2 bg-white border rounded-lg ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          setFormData({ ...formData, category: e.target.value });
                          if (errors.category) setErrors({ ...errors, category: '' });
                        }}
                        className={`w-full px-4 py-2 bg-white border rounded-lg ${
                          errors.category ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="saude">Saúde</option>
                        <option value="produtividade">Produtividade</option>
                        <option value="financeiro">Financeiro</option>
                        <option value="pessoal">Pessoal</option>
                        <option value="estudos">Estudos</option>
                        <option value="social">Social</option>
                        <option value="criatividade">Criatividade</option>
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frequência *</label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => {
                          setFormData({ ...formData, frequency: e.target.value });
                          if (errors.frequency) setErrors({ ...errors, frequency: '' });
                        }}
                        className={`w-full px-4 py-2 bg-white border rounded-lg ${
                          errors.frequency ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="diario">Diário</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                      </select>
                      {errors.frequency && (
                        <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta</label>
                      <input
                        type="text"
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Salvar alterações
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-600">Categoria:</span>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {categoryLabels[habit.category] || habit.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Frequência:</span>
                      <span className="ml-2">
                        {habit.frequency === 'diario' && 'Diário'}
                        {habit.frequency === 'semanal' && 'Semanal'}
                        {habit.frequency === 'mensal' && 'Mensal'}
                      </span>
                    </div>
                    {habit.goal && (
                      <div>
                        <span className="text-sm text-gray-600">Meta:</span>
                        <span className="ml-2">{habit.goal}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        habit.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {habit.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Consistency Score */}
              <ConsistencyScore
                consistency={habit.consistency?.consistency || 0}
                streak={habit.streak || 0}
                bestStreak={habit.bestStreak || 0}
              />
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Ações</h3>
              {!habit.isCompletedToday && (
                <button
                  onClick={handleMarkComplete}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Marcar como concluído hoje
                </button>
              )}
              {habit.isCompletedToday && (
                <p className="text-green-600">✓ Hábito já foi marcado como concluído hoje</p>
              )}
            </div>

            {/* Calendar */}
            <HabitCalendar habitId={habitId} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
