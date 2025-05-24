import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/services/api"
import PointButton from "../PointButton"
import { useNavigate } from "react-router"

interface UltimaMarcacaoResumoDTO {
	nome: string
	entrada: string
	pausa: string
	retomada: string
	saida: string
	total: string
}

export function RecentTimeEntries() {
	const [entries, setEntries] = useState<UltimaMarcacaoResumoDTO[]>([])
	const navigate = useNavigate()

	useEffect(() => {
		const fetchEntries = async () => {
			try {
				const response = await api.get('/marcacoes/ultimas-hoje')
				setEntries(response.data)
			} catch (err) {
				console.error('Erro ao buscar últimas marcações:', err)
			}
		}

		fetchEntries()
	}, [])

	const handleButtonClick = () => {
		navigate('/admin/marcacoes')
	}

	const formatHora = (hora: string) => hora ? hora.slice(0, 5) : "--:--"

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button variant="outline" size="sm" onClick={handleButtonClick}>
					Ver Todas
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{entries.map((entry, index) => {
					return (
						<Card key={index} className="overflow-hidden">
							<CardContent className="p-0">
								<div className="p-4 flex justify-between items-center">
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarImage src="/placeholder-user.jpg" alt={entry.nome} />
											<AvatarFallback>{entry.nome.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
										</Avatar>
										<span className="font-medium">{entry.nome}</span>
									</div>
									<div className="text-sm font-medium">{entry.total}</div>
								</div>

								<div className="flex justify-between p-4 pt-0">
									{[
										{ label: 'Entrada', hora: entry.entrada, icon: <i className="fa-solid fa-door-open text-3xl"></i>, color: "main-green-color" },
										{ label: 'Pausa', hora: entry.pausa, icon: <i className="fa-solid fa-mug-hot text-3xl"></i>, color: "main-blue-color" },
										{ label: 'Retomada', hora: entry.retomada, icon: <i className="fa-solid fa-battery-full text-3xl"></i>, color: "main-yellow-color" },
										{ label: 'Saída', hora: entry.saida, icon: <i className="fa-solid fa-door-closed text-3xl"></i>, color: "main-red-color" }
									].map((item, idx) => (
										<div key={idx} className="flex flex-col items-center">
											<div className="w-17 h-17 mb-3">
												<PointButton icon={item.icon} color={item.color} />
											</div>
											<span className="text-xs text-center">{formatHora(item.hora)}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
				 )
				})}
			</div>
		</div>
	)
}
