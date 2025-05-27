import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck, Clock, UserCheck, UserX } from "lucide-react"
import api from "@/services/api"

export function DashboardStats() {
	const [colaboradores, setColaboradores] = useState<number>(0)
	const [colaboradoresDiferenca, setColaboradoresDiferenca] = useState<number>(0)
	const [faltas, setFaltas] = useState<number>(0)
	const [faltaDiferenca, setFaltaDiferenca] = useState<number>(0)
	const [solicitacoes, setSolicitacoes] = useState<number>(0)
	const [solicitacoesDiferenca, setSolicitacoesDiferenca] = useState<number>(0)
	const [horasExtras, setHorasExtras] = useState<number>(0)
	const [horasExtrasDiferenca, setHorasExtrasDiferenca] = useState<number>(0)

	const fetchColaboradores = async () => {
		try {
			const response = await api.get('/colaborador')
			setColaboradores(response.data.length)
		} catch (err) {
			console.error(err)
		}
	}

	const fetchColaboradoresDiferenca = async () => {
		try {
			const response = await api.get('/colaborador/diferenca-ativos-mes')
			setColaboradoresDiferenca(response.data)
		} catch (err) {
			console.error(err)
		}
	}

	const fetchFaltas = async () => {
		try {
			const response = await api.get('/falta')
			setFaltas(response.data.length)
		} catch (err) {
			console.error(err)
		}
	}

	const fetchFaltaDiferenca = async () => {
		try {
			const response = await api.get('/falta/diferenca-dia')
			setFaltaDiferenca(response.data)
		} catch (err) {
			console.error(err)
		}
	}

	const fetchSolicitacoes = async () => {
		try {
			const response = await api.get('/resumo-solicitacoes')
			setSolicitacoes(response.data.totalPendentes)
			setSolicitacoesDiferenca(response.data.diferencaHojeOntem)
		} catch (err) {
			console.error(err)
		}
	}

	const fetchHorasExtras = async () => {
		try {
			const response = await api.get('/horas-extras/resumo-mensal')
			setHorasExtras(response.data.totalMesAtual)
			setHorasExtrasDiferenca(response.data.diferencaEmHoras)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		fetchColaboradores()
		fetchFaltas()
		fetchHorasExtras()
		fetchSolicitacoes()
		fetchFaltaDiferenca()
		fetchColaboradoresDiferenca()
	}, [])

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Colaboradores Ativos</CardTitle>
					<UserCheck className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{colaboradores}</div>
					<p className="text-xs text-muted-foreground">{colaboradoresDiferenca > 0 ? `+${colaboradoresDiferenca}` : colaboradoresDiferenca} desde o último mês</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Faltas/Ausências</CardTitle>
					<UserX className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{faltas}</div>
					<p className="text-xs text-muted-foreground">{faltaDiferenca > 0 ? `+${faltaDiferenca}` : faltaDiferenca} desde ontem</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
					<ClipboardCheck className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{solicitacoes}</div>
					<p className="text-xs text-muted-foreground">{solicitacoesDiferenca > 0 ? `+${solicitacoesDiferenca}` : solicitacoesDiferenca} novas solicitações hoje</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Horas Extras (Mês)</CardTitle>
					<Clock className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{horasExtras}</div>
					<p className="text-xs text-muted-foreground">{horasExtrasDiferenca > 0 ? `+${horasExtrasDiferenca}` : horasExtrasDiferenca} desde o mês passado</p>
				</CardContent>
			</Card>
		</div>
	)
}
