'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../components/NotificationProvider';
import { validateEmail, validatePassword, validateName, formatErrorMessage } from '../../utils/validation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showError, showSuccess } = useNotification();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});

    // Validações
    const nameValidation = validateName(formData.name);
    if (!nameValidation.valid) {
      setErrors({ name: nameValidation.message });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Email inválido' });
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setErrors({ password: passwordValidation.message });
      return;
    }

    // Validação de confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData.name, formData.email, formData.password);
      
      if (result.success) {
        showSuccess('Conta criada com sucesso! Bem-vindo ao GrowTrack! 🎉');
        router.push('/dashboard');
      } else {
        const errorMsg = result.message || 'Erro ao cadastrar';
        setError(errorMsg);
        showError(errorMsg);
        if (result.errors) {
          const errorObj = {};
          result.errors.forEach((err) => {
            if (err.includes('Nome')) errorObj.name = err;
            else if (err.includes('Email')) errorObj.email = err;
            else if (err.includes('Senha')) errorObj.password = err;
          });
          setErrors(errorObj);
        }
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
                <h1 className="text-3xl font-bold mb-2">Crie sua conta</h1>
                <p className="text-gray-600">Junte-se ao GrowTrack e comece a transformar sua vida hoje</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo
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
                    placeholder="Seu nome completo"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="seu@email.com"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    required
                  />
                  <small className="text-gray-500 text-sm">A senha deve ter pelo menos 8 caracteres</small>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Digite a senha novamente"
                    required
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 bg-white text-primary border-gray-300 rounded focus:ring-primary"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    Aceito os <Link href="#" className="text-primary hover:underline">Termos de Uso</Link> e{' '}
                    <Link href="#" className="text-primary hover:underline">Política de Privacidade</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {loading ? 'Criando conta...' : 'Criar conta gratuita'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-primary hover:underline">
                    Faça login aqui
                  </Link>
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-lg text-white flex items-center border border-primary/20">
              <div>
                <div className="text-6xl mb-6">🚀</div>
                <h3 className="text-2xl font-bold mb-4">Comece sua transformação</h3>
                <p className="mb-8 opacity-90">
                  Com o GrowTrack, você terá todas as ferramentas necessárias para desenvolver e manter hábitos positivos.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <strong>Acompanhamento visual do progresso</strong>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <strong>Sistema de streaks motivacional</strong>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <strong>Hábitos personalizados para qualquer área</strong>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <strong>Interface simples e intuitiva</strong>
                    </div>
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

