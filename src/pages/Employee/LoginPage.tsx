import React, { useState } from 'react';
import logo from "../../assets/logo.png"
import api from '../../services/api'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router'

function LoginPage() {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault()
		const formData = {
			email,
			senhaHash: password
		}

		try {
			const response = await api.post('/login', formData)
			localStorage.setItem("id", response.data.id)
			localStorage.setItem("nome", response.data.nome)
			localStorage.setItem("email", response.data.email)
			localStorage.setItem("criado_em", response.data.criadoEm)
			localStorage.setItem("ativo", response.data.ativo)
			navigate('/')
		} catch (err: unknown) {
			toast.error('Suas credenciais estão erradas')
		}
	}

	return (
		<div className="flex flex-col items-center justify-center p-4 min-h-screen">
			<div className="mt-18 mb-12">
				<img
					src={logo}
					alt="Checkpoint Logo"
					className="w-54"
				/>
			</div>

			{/* Formulário de Login */}
			<form onSubmit={handleSubmit} className="w-full max-w-md">
				<div className="mb-6">
					<label htmlFor="email">
						Email
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Digite seu email"
						required
						className="w-full rounded-lg focus:border-blue-500 focus:outline-none mt-2"
					/>
				</div>

				<div className="mb-6">
					<label htmlFor="password">
						Senha
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Digite sua senha"
						required
						className="w-full rounded-lg focus:border-blue-500 focus:outline-none mt-2"
					/>
				</div>

				{/* Link "Esqueci minha senha" */}
				<div className="mb-8 text-center">
					<a
						href="/recuperar-senha"
						className="text-blue-600 hover:text-blue-800 underline text-sm"
					>
						Esqueci minha senha
					</a>
				</div>

				<button
					type="submit"
					className="w-full main-func-color font-semibold main-white-text py-3 rounded-lg transition duration-200"
				>
					Entrar
				</button>
			</form>

			<footer className="flex flex-col flex-grow justify-end pt-4 text-gray-400 text-xs w-full text-center">
				Desenvolvido por FR0M_ZER0
			</footer>

			<ToastContainer
				hideProgressBar={true}
				pauseOnFocusLoss={false}
				theme='colored'
			/>
		</div>
	)
}

export default LoginPage
