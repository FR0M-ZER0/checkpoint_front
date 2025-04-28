import { useState, useEffect, FormEvent } from "react"
import { RootState } from "@/redux/store"
import { useSelector, useDispatch } from "react-redux"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Eye, MoreHorizontal } from "lucide-react"
import { RequestDetailsDialog } from "./RequestDetailsDialog"
import { FolgaSolicitation, removeSolicitation, Solicitation, VacationSolicitation } from "@/redux/slices/solicitationSlice"
import { formatDate } from "@/utils/formatter"
import api from "@/services/api"
import { toast } from "react-toastify"
import { parseBRDate } from "@/utils/formatter"

type RequestType = "ajustes" | "ferias" | "folgas" | "ausencias"

interface RequestsTableProps {
	type: RequestType
}

interface Request {
	id: number
	employee: string
	department: string
	date: string
	requestDate: string
	status: "Pendente" | "Aprovado" | "Rejeitado"
	details: string
}

export function RequestsTable({ type }: RequestsTableProps) {
	const { solicitations } = useSelector((state: RootState) => state.solicitations)
	const { vacationSolicitations } = useSelector((state: RootState) => state.solicitations)
	const { folgaSolicitations } = useSelector((state: RootState) => state.solicitations)
	const [requests, setRequests] = useState<Solicitation[] | VacationSolicitation[] | FolgaSolicitation[]>([])
	const dispatch = useDispatch()

	useEffect(() => {
		if (type === "ajustes") {
			setRequests(solicitations)
		} else if (type === "ferias") {
			setRequests(vacationSolicitations)
		} else if (type === "folgas") {
			const mappedFolgas = folgaSolicitations.map((folga) => ({
				id: folga.solFolId,
				colaborador: folga.colaborador,
				department: folga.department,
				data: folga.solFolData,
				criadoEm: folga.criadoEm,
				saldoGasto: folga.solFolSaldoGasto,
				observacao: folga.solFolObservacao,
				status: folga.solFolStatus,
			}))
			setRequests(mappedFolgas)
		} else {
			setRequests([])
		}
	}, [type, solicitations, vacationSolicitations, folgaSolicitations])

	const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
	const [isDetailsOpen, setIsDetailsOpen] = useState(false)

	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 15
	const totalPages = Math.ceil(requests.length / itemsPerPage)

	const paginatedRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

	const handleStatusChange = (id: number, newStatus: "Aprovado" | "Rejeitado") => {
		setRequests(requests.map((request) => (request.id === id ? { ...request, status: newStatus } : request)))
	}

	const handleViewDetails = (request: Request) => {
		setSelectedRequest(request)
		setIsDetailsOpen(true)
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	console.log(requests)

	const handleApprove = async (id: number) => {
		const solicitation = paginatedRequests.find((r) => r.id === id)
		if (!solicitation) return

		try {
			if (type === 'ajustes') {
				await api.put(`/ajuste-ponto/solicitacao/${id}`, { status: 'aceito' })

				if (solicitation.tipo === 'edicao') {
					await api.put(`/marcacoes/${solicitation.marcacaoId}/horario`, { novoHorario: solicitation.horario })
				} else {
					await api.delete(`/marcacoes/${solicitation.marcacaoId}`)
				}

				toast.success('Ajuste realizado com sucesso')
			} else if (type === 'ferias') {
				await api.put(`/solicitacao-ferias/${id}`, { status: 'Aprovado' })

				await api.post('/api/ferias', {
					colaboradorId: solicitation.colaboradorId,
					dataInicio: solicitation.dataInicio,
					dataFim: solicitation.dataFim,
				})

				toast.success('Férias criadas com sucesso')
			} else if (type === 'folgas') {
				await api.put(`/solicitacao-folga/${id}`, { solFolStatus: 'Aprovado' })
				await api.post('/api/folga', {
					colaboradorId: solicitation.colaborador.id,
					data: parseBRDate(solicitation.data),
					saldoGasto: solicitation.saldoGasto
				})

				toast.success('Folga criada com sucesso')
			} else {
				handleStatusChange(id, "Aprovado")
			}

			dispatch(removeSolicitation(id))
		} catch (error) {
			console.error(error)
			toast.error('Erro ao aprovar solicitação')
		}
	}

	const handleReject = async (id: number) => {
		try {
			if (type === 'ajustes') {
				await api.put(`/ajuste-ponto/solicitacao/${id}`, { status: 'rejeitado' })
			} else if (type === 'ferias') {
				await api.put(`/solicitacao-ferias/${id}`, { status: 'Rejeitado' })
			} else if (type === 'folgas') {
				await api.put(`/solicitacao-folga/${id}`, { status: 'Rejeitado' })
			} else {
				handleStatusChange(id, "Rejeitado")
			}

			toast.error('Solicitação rejeitada com sucesso')
			dispatch(removeSolicitation(id))
		} catch (error) {
			console.error(error)
			toast.error('Erro ao rejeitar solicitação')
		}
	}


	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{
							type === 'ajustes' ?
								<TableRow>
									<TableHead>Colaborador</TableHead>
									<TableHead>Departamento</TableHead>
									<TableHead>Período</TableHead>
									<TableHead>Data da Solicitação</TableHead>
									<TableHead>Tipo</TableHead>
									<TableHead>Horario</TableHead>
									<TableHead>Observação</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Ações</TableHead>
								</TableRow>
								:
								<TableRow>
									<TableHead>Colaborador</TableHead>
									<TableHead>Departamento</TableHead>
									<TableHead>Data</TableHead>
									<TableHead>Data da Solicitação</TableHead>
									<TableHead>Observação</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Ações</TableHead>
								</TableRow>
						}
					</TableHeader>
					<TableBody>
						{paginatedRequests.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="h-24 text-center">
									Nenhuma solicitação encontrada.
								</TableCell>
							</TableRow>
						) : type === 'ajustes' ? (
							paginatedRequests.map((request) => (
								<TableRow key={request.id}>
									<TableCell className="font-medium">{request.colaboradorNome}</TableCell>
									<TableCell>{request.department}</TableCell>
									<TableCell>{request.periodo}</TableCell>
									<TableCell>{formatDate(request.criadoEm)}</TableCell>
									<TableCell>{request.tipo}</TableCell>
									<TableCell>{request.horario}</TableCell>
									<TableCell className="max-w-[200px] truncate">{request.observacao}</TableCell>
									<TableCell>
										<Badge
											variant={request.status === "rejeitado" ? "destructive" : "outline"}
											className={request.status === "aceito" ? "bg-green-600 text-white" : ""}
										>
											{request.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="h-8 w-8">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Abrir menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Ações</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={() => handleViewDetails(request)}>
													<Eye className="mr-2 h-4 w-4" />
													<span>Ver detalhes</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						) : (
							paginatedRequests.map((request) => (
								<TableRow key={request.id}>
									<TableCell className="font-medium">{request.colaborador?.nome}</TableCell>
									<TableCell>{request.department}</TableCell>
									{
										type === 'ferias' ?
										<TableCell>
											{formatDate(request.dataInicio)}-{formatDate(request.dataFim)}
										</TableCell>
										:
										<TableCell>
											{formatDate(request.data)}
										</TableCell>
									}

									<TableCell>{formatDate(request.criadoEm)}</TableCell>
									<TableCell className="max-w-[200px] truncate">{request.observacao}</TableCell>
									<TableCell>
										<Badge
											variant={request.status === "Rejeitado" ? "destructive" : "outline"}
											className={request.status === "Aprovado" ? "bg-green-600 text-white" : ""}
										>
											{request.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="h-8 w-8">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Abrir menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Ações</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={() => handleViewDetails(request)}>
													<Eye className="mr-2 h-4 w-4" />
													<span>Ver detalhes</span>
												</DropdownMenuItem>
												<DropdownMenuItem>Histórico</DropdownMenuItem>
												{request.status !== "Pendente" && (
													<DropdownMenuItem onClick={() => handleStatusChange(request.id, "Pendente")}>
														Reverter status
													</DropdownMenuItem>
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-end space-x-2 py-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<ChevronLeft className="h-4 w-4" />
						<span className="sr-only">Página anterior</span>
					</Button>
					<div className="flex items-center gap-1">
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<Button
								key={page}
								variant={currentPage === page ? "default" : "outline"}
								size="sm"
								className="h-8 w-8 p-0"
								onClick={() => handlePageChange(page)}
							>
								{page}
							</Button>
						))}
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						<ChevronRight className="h-4 w-4" />
						<span className="sr-only">Próxima página</span>
					</Button>
				</div>
			)}

			<RequestDetailsDialog
				request={selectedRequest}
				open={isDetailsOpen}
				onOpenChange={setIsDetailsOpen}
				onApprove={handleApprove}
				onReject={handleReject}
				type={type}
			/>
		</>
	)
}
