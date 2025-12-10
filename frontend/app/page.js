import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Transforme seus objetivos em{' '}
                <span className="text-yellow-300">hábitos duradouros</span>
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Acompanhe seu progresso, mantenha a consistência e alcance seus objetivos com o GrowTrack.
                A plataforma mais simples e visual para desenvolver hábitos positivos.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/register"
                  className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Comece grátis
                </Link>
                <Link
                  href="/login"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
                >
                  Já tenho conta
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Por que escolher o GrowTrack?</h2>
              <p className="text-gray-600 text-lg">
                Uma plataforma completa para desenvolver e manter hábitos positivos
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-100">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Acompanhamento Visual</h3>
                <p className="text-gray-600">
                  Visualize seu progresso com gráficos intuitivos e estatísticas detalhadas.
                  Veja sua evolução ao longo do tempo e mantenha-se motivado.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-100">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Metas Personalizadas</h3>
                <p className="text-gray-600">
                  Crie hábitos personalizados para qualquer área da sua vida: saúde,
                  produtividade, estudos, finanças e muito mais.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-100">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-xl font-semibold mb-2">Sistema de Streaks</h3>
                <p className="text-gray-600">
                  Mantenha sua motivação com o sistema de sequências. Quanto mais consistente
                  você for, maior será sua pontuação.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-100">
          <div className="container-custom px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para transformar sua vida?</h2>
            <p className="text-gray-600 text-lg mb-8">
              Junte-se a milhares de pessoas que já estão desenvolvendo hábitos positivos com o GrowTrack.
            </p>
            <Link
              href="/register"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition inline-block"
            >
              Criar conta gratuita
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

