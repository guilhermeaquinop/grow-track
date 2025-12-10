'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../components/NotificationProvider';
import { validateEmail, formatErrorMessage } from '../../utils/validation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showError, showSuccess } = useNotification();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validações básicas
    if (!validateEmail(email)) {
      setError('Email inválido');
      showError('Por favor, insira um email válido');
      return;
    }

    if (!password) {
      setError('Senha é obrigatória');
      showError('Por favor, insira sua senha');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        showSuccess('Login realizado com sucesso! Bem-vindo de volta! 👋');
        router.push('/dashboard');
      } else {
        const errorMsg = result.message || 'Erro ao fazer login';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      const errorMsg = formatErrorMessage(error);
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <section className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h1>
                <p className="text-gray-600">Entre na sua conta para continuar acompanhando seus hábitos</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Sua senha"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 bg-white text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Lembrar-me neste dispositivo
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p>
                  <Link href="#" className="text-primary hover:underline text-sm">
                    Esqueceu sua senha?
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <Link href="/register" className="text-primary hover:underline">
                    Cadastre-se gratuitamente
                  </Link>
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-lg text-white flex items-center border border-primary/20">
              <div>
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold mb-4">Continue sua jornada</h3>
                <p className="mb-8 opacity-90">
                  Mantenha o foco nos seus objetivos e veja seu progresso crescer a cada dia.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">7</div>
                    <div className="text-sm opacity-80">Hábitos ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">15</div>
                    <div className="text-sm opacity-80">Dias de streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">89%</div>
                    <div className="text-sm opacity-80">Taxa de sucesso</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

