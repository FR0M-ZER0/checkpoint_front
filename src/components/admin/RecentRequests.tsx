import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import api from "@/services/api"
import { formatDate } from "@/utils/formatter"
import { useNavigate } from "react-router"

type Request = {
	id: number | string
	colaboradorNome: string
	tipo: string
	criadoEm: string
	status: string
}

export function RecentRequests() {
	const [requests, setRequests] = useState<Request[]>([])
	const navigate = useNavigate()

	const handleButtonClick = () => {
		navigate('/admin/solicitacoes')
	}

	const fetchRequests = async () => {
		try {
			const response = await api.get('/ultimas-solicitacoes-pendentes')
			setRequests(response.data)
		} catch (err) {
			console.error(err)
		}
	}

	const getInitials = (nome: string) => {
		const names = nome.split(" ")
		if (names.length === 1) return names[0][0].toUpperCase()
		return (names[0][0] + names[names.length - 1][0]).toUpperCase()
	}

	useEffect(() => {
		fetchRequests()
	}, [])

	return (
		<div className="space-y-4">
			{requests.map((request) => (
				<div key={request.id} className="flex items-center justify-between space-x-4 rounded-md border p-4">
					<div className="flex items-center space-x-4">
						<Avatar>
							<AvatarFallback>{getInitials(request.colaboradorNome)}</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium leading-none">{request.colaboradorNome}</p>
							<p className="text-sm text-muted-foreground">{request.tipo}</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Badge variant="outline">{formatDate(request.criadoEm)}</Badge>
						<Badge>{request.status}</Badge>
					</div>
				</div>
			))}
			<div className="flex justify-center">
				<Button variant="outline" size="sm" onClick={handleButtonClick}>
					Ver todas as solicitações
				</Button>
			</div>
		</div>
	)
}
