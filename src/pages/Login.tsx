import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
// import { Building2 } from 'lucide-react'; // Removido pois não é mais usado

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-primary/80 via-accent/40 to-background">
      {/* Lado esquerdo - Imagem/Background */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <div className="max-w-md text-center px-12">
          {/* Logo fictícia grande */}
          <div className="mx-auto mb-8 w-28 h-28 rounded-full bg-gradient-to-tr from-primary via-accent to-primary/80 flex items-center justify-center shadow-card">
            <span className="text-white text-3xl font-extrabold tracking-tight drop-shadow-lg">RA</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Reserva Alta Vista
          </h2>
          <p className="text-blue-100 text-lg">
            Gerencie seus chamados e serviços de forma eficiente
          </p>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background/60">
        <div className="max-w-md w-full space-y-8">
          {/* Logo fictícia para mobile */}
          <div className="lg:hidden text-center mb-6">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-tr from-primary via-accent to-primary/80 flex items-center justify-center shadow-card">
              <span className="text-white text-2xl font-extrabold tracking-tight drop-shadow-lg">RA</span>
            </div>
            <h2 className="text-2xl font-extrabold text-secondary tracking-tight">
              Reserva Alta Vista
            </h2>
          </div>

          <div className="bg-white/70 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-500 mb-8">
              Faça login para acessar o sistema
            </p>

            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <div className="text-sm text-red-600">{error}</div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Usuário
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-card placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out"
                    placeholder="Digite seu usuário"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-card placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-card text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;