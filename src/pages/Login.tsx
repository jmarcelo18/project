import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2 } from 'lucide-react';

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
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Imagem/Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center">
        <div className="max-w-md text-center px-12">
          <Building2 className="h-24 w-24 text-white mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Sistema Alta Vista
          </h2>
          <p className="text-blue-100 text-lg">
            Gerencie seus chamados e serviços de forma eficiente
          </p>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo para mobile */}
          <div className="lg:hidden text-center">
            <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              Sistema Alta Vista
            </h2>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-600 mb-8">
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
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
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
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
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