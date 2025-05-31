import React from 'react';
import logo from "../../assets/logo.png";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';
import api from '../../services/api';

function LoginPageAdmin() {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();
		setLoading(true);

		const formData = {
			email,
			senha: password
		};

		try {
			const response = await api.post('/admin/login', formData);

			if (response.status === 202) {
				localStorage.setItem("email_2fa_admin", email);
				toast.info("Código enviado por e-mail");
				navigate('/verificar-codigo-admin');
			} else {
				localStorage.setItem("admin_id", response.data.id);
				localStorage.setItem("admin_nome", response.data.nome);
				localStorage.setItem("admin_email", response.data.email);
				localStorage.setItem("admin_criado_em", response.data.criadoEm);
				localStorage.setItem("admin_ativo", response.data.ativo);
				navigate('/admin/dashboard');
			}
		} catch (err: unknown) {
			toast.error('Suas credenciais estão erradas');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#EDEDED]">
			<div className="mt-18 mb-12 text-center">
				<img src={logo} alt="Checkpoint Logo" className="w-54" />
				<p className="text-lg mt-4">Área administrativa</p>
			</div>

			<form onSubmit={handleSubmit} className="w-full max-w-md">
				<div className="mb-6">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Digite seu email"
						required
						className="w-full rounded-lg focus:border-blue-500 focus:outline-none mt-2 input-col"
					/>
				</div>

				<div className="mb-6">
					<label htmlFor="password">Senha</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Digite sua senha"
						required
						className="w-full rounded-lg focus:border-blue-500 focus:outline-none mt-2 input-col"
					/>
				</div>

				<div className="mb-8 text-center">
					<a href="/recuperar-senha" className="text-blue-600 hover:text-blue-800 underline text-sm">
						Esqueci minha senha
					</a>
				</div>

				<button
					type="submit"
					disabled={loading}
					className={`w-full main-func-color font-semibold main-white-text py-3 rounded-lg transition duration-200 ${
						loading ? 'opacity-50 cursor-not-allowed' : ''
					}`}
				>
					{loading ? 'Entrando...' : 'Entrar'}
				</button>
			</form>

			<footer className="flex flex-col flex-grow justify-end pt-4 text-gray-400 text-xs w-full text-center">
				Desenvolvido por FR0M_ZER0
			</footer>

			<ToastContainer hideProgressBar pauseOnFocusLoss={false} theme="colored" />
		</div>
	);
}

export default LoginPageAdmin;
