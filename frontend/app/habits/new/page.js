'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../context/AuthContext';
import { habitsAPI } from '../../../services/api';
import { useNotification } from '../../../components/NotificationProvider';
import { validateHabitName, validateHabitDescription, formatErrorMessage } from '../../../utils/validation';

export default function NewHabitPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    frequency: 'diario',
    goal: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const { showSuccess, showError } = useNotification();

  if (authLoading) {
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

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpar erro do campo
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameValidation = validateHabitName(formData.name);
    if (!nameValidation.valid) {
      newErrors.name = nameValidation.message;
    }

    const descValidation = validateHabitDescription(formData.description);
    if (!descValidation.valid) {
      newErrors.description = descValidation.message;
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});

    if (!validateForm()) {
      showError('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      await habitsAPI.create(formData);
      showSuccess('Hábito criado com sucesso! 🎉');
      router.push('/habits');
    } catch (error) {
      const errorMsg = formatErrorMessage(error);
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: 'saude', label: '🏥 Saúde' },
    { value: 'produtividade', label: '⚡ Produtividade' },
    { value: 'financeiro', label: '💰 Financeiro' },
    { value: 'pessoal', label: '👤 Pessoal' },
    { value: 'estudos', label: '📚 Estudos' },
    { value: 'social', label: '👥 Social' },
    { value: 'criatividade', label: '🎨 Criatividade' },
  ];

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
              <span>Novo Hábito</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Criar novo hábito</h1>
            <p className="text-lg opacity-90">Defina seu novo hábito e comece sua jornada de transformação</p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-8">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do hábito *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Beber água, Exercitar-se, Ler livros"
                    maxLength={50}
                    required
                  />
                  <small className="text-gray-500 text-sm">Escolha um nome claro e motivador para seu hábito</small>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Descreva seu hábito e por que ele é importante para você..."
                    maxLength={200}
                  />
                  <small className="text-gray-500 text-sm">Opcional: Adicione detalhes sobre seu hábito</small>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência *
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="diario">📅 Diário</option>
                    <option value="semanal">📆 Semanal</option>
                    <option value="mensal">🗓️ Mensal</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta diária
                  </label>
                  <input
                    type="text"
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: 8 copos, 30 minutos, 20 páginas"
                  />
                  <small className="text-gray-500 text-sm">Opcional: Defina uma meta específica para seu hábito</small>
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t">
                  <Link
                    href="/habits"
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    {loading ? 'Criando...' : 'Criar hábito'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

