'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useDatabaseStatus } from '../hooks/useDatabaseStatus';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { isUsingDatabase } = useDatabaseStatus();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom px-4">
        <div className="flex items-center justify-between py-4 gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <span>🌱</span>
            <span>GrowTrack</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Indicador de modo JSON */}
            {!isUsingDatabase && (
              <div 
                className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium"
                title="Aplicação está usando armazenamento JSON local (modo de teste)"
              >
                <span>📄</span>
                <span className="hidden sm:inline">Modo JSON</span>
              </div>
            )}
            
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-primary transition">
                Home
              </Link>
              
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary transition">
                    Dashboard
                  </Link>
                  <Link href="/habits" className="text-gray-700 hover:text-primary transition">
                    Meus Hábitos
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary transition"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-primary transition">
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Cadastro
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

