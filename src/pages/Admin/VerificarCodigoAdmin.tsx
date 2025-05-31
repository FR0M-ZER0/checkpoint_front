import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../services/api';
import logo from '../../assets/logo.png';

const VerificarCodigoAdmin = () => {
	const [codigo, setCodigo] = useState<string[]>(Array(6).fill(''));
	const inputsRef = useRef<HTMLInputElement[]>([]);
	const navigate = useNavigate();
	const email = localStorage.getItem('email_2fa_admin') || '';

	const handleChange = (value: string, index: number) => {
		if (!/^\d?$/.test(value)) return;
		const newCodigo = [...codigo];
		newCodigo[index] = value;
		setCodigo(newCodigo);
		if (value && index < 5) {
			inputsRef.current[index + 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
		if (pasted.length === 6) {
			const newCodigo = pasted.split('');
			setCodigo(newCodigo);
			newCodigo.forEach((char, i) => {
				if (inputsRef.current[i]) {
					inputsRef.current[i]!.value = char;
				}
			});
			inputsRef.current[5]?.focus();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
		if (e.key === 'Backspace' && !codigo[index] && index > 0) {
			const newCodigo = [...codigo];
			newCodigo[index - 1] = '';
			setCodigo(newCodigo);
			inputsRef.current[index - 1]?.focus();
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const codigoFinal = codigo.join('');
		if (codigoFinal.length !== 6) {
			toast.error('Digite os 6 dígitos do código.');
			return;
		}

		try {
			const response = await api.post(`/admin/verificar-codigo?email=${email}&codigo=${codigoFinal}`);
			const admin = response.data;

			localStorage.setItem("admin_id", admin.id);
			localStorage.setItem("admin_nome", admin.nome);
			localStorage.setItem("admin_email", admin.email);
			localStorage.setItem("admin_criado_em", admin.criadoEm);
			localStorage.setItem("admin_ativo", admin.ativo);

			toast.success('Código verificado com sucesso!');
			navigate('/admin/dashboard');
		} catch (err) {
			toast.error('Código inválido ou expirado');
			console.error(err);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen px-4" style={{ backgroundColor: '#EDEDED' }}>
			<div className="flex flex-col items-center justify-center w-full max-w-md">
				<div className="mb-8">
					<img src={logo} alt="Checkpoint Logo" className="w-48" />
				</div>

				<h2 className="mb-4 text-xl font-semibold text-center">Verificação 2FA - Admin</h2>
				<p className="mb-6 text-center text-gray-600 text-sm">
					Insira o código enviado para seu e-mail. Ele expira em 5 minutos.
				</p>

				<form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
					<div className="flex justify-center gap-3 mb-6">
						{codigo.map((num, i) => (
							<input
								key={i}
								ref={(el) => {
									if (el) inputsRef.current[i] = el;
								}}
								type="text"
								maxLength={1}
								value={codigo[i]}
								onChange={(e) => handleChange(e.target.value, i)}
								onKeyDown={(e) => handleKeyDown(e, i)}
								onPaste={i === 0 ? handlePaste : undefined}
								className="w-12 h-12 text-center text-xl rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 bg-white"
							/>
						))}
					</div>

					<button
						type="submit"
						className="w-full main-func-color font-semibold main-white-text py-3 rounded-lg transition duration-200"
					>
						Verificar
					</button>
				</form>

				

				<ToastContainer hideProgressBar pauseOnFocusLoss={false} theme="colored" />
			</div>
		</div>
	);
};

export default VerificarCodigoAdmin;
