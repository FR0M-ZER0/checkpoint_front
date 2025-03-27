import React from 'react';
import logo from "../../assets/logo.png";

function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de login aqui
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#EDEDED]">
      <div className="mt-18 mb-12 text-center">
        <img 
          src={logo}
          alt="Checkpoint Logo" 
          className="w-120" 
        />
        <h1 className="font-inter text-xl mt-4">Área administrativa</h1>
      </div>

      {/* Formulário de Login */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-800 font-medium mb-2 text-lg">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-800 font-medium mb-2 text-lg">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>

        {/* Link "Esqueci minha senha" */}
        <div className="mb-8 text-center">
          <a 
            href="/recuperar-senha" 
            className="text-blue-600 hover:text-blue-800 text-md underline"
          >
            Esqueci minha senha
          </a>
        </div>

        <button
          type="submit"
          className="w-full main-func-color text-white font-bold py-4 px-6 rounded-lg text-lg transition duration-200"
        >
          Entrar
        </button>
      </form>

      <footer className="flex flex-col flex-grow justify-end py-4 text-gray-400 text-xs w-full text-center">
        Desenvolvido por FR0M_ZER0
      </footer>
    </div>
  );
}

export default LoginPage;