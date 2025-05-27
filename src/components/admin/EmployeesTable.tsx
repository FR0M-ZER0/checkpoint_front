import { useEffect, useState, forwardRef, useImperativeHandle } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import api from "@/services/api"
import { EditCollaboratorDialog } from "./EditCollaboratorDialog"

type Colaborador = {
	id: number
	nome: string
	email: string
	ativo: boolean
	criadoEm: string
}

export type EmployeesTableHandle = {
	refresh: () => void
}

type EmployeesTableProps = {
	searchQuery: string
	statusFilter: string
	sortBy: string
	sortOrder: "asc" | "desc"
}

export const EmployeesTable = forwardRef<EmployeesTableHandle, EmployeesTableProps>(
	({ searchQuery, statusFilter, sortBy, sortOrder }, ref) => {
	const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
	const [selectedEmployee, setSelectedEmployee] = useState<Colaborador | null>(null)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 15

	useImperativeHandle(ref, () => ({
		refresh: fetchColaboradores
	}))

	const fetchColaboradores = async () => {
		try {
			let url = "/colaborador"

			if (searchQuery) {
				url = `/colaborador/buscar?nome=${encodeURIComponent(searchQuery)}`
			}

			else if (statusFilter !== "all") {
				const ativo = statusFilter === "active" ? "true" : "false"
				url = `/colaborador/status?ativo=${ativo}`
			}

			else if (sortBy) {
				const campo = sortBy === "name" ? "nome" : "criadoEm"
				url = `/colaborador/ordenar?campo=${campo}&ordem=${sortOrder}`
			}

			const response = await api.get(url)
			setColaboradores(response.data)
		} catch (err) {
			console.error(err)
		}
	}

	const totalPages = Math.ceil(colaboradores.length / itemsPerPage)
	const paginatedEmployees = colaboradores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	const getInitials = (nome: string) => {
		const names = nome.split(" ")
		if (names.length === 1) return names[0][0].toUpperCase()
		return (names[0][0] + names[names.length - 1][0]).toUpperCase()
	}

	const toggleActive = async (colaborador: Colaborador) => {
		try {
			await api.put(`/colaborador/${colaborador.id}`, {
				ativo: !colaborador.ativo
			})
			await fetchColaboradores()
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		fetchColaboradores()
	}, [searchQuery, statusFilter, sortBy, sortOrder])

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Colaborador</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Criado em</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedEmployees.map((employee) => (
							<TableRow key={employee.id}>
								<TableCell>
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarFallback>{getInitials(employee.nome)}</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">{employee.nome}</p>
											<p className="text-sm text-muted-foreground">{employee.email}</p>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge
										variant={employee.ativo ? "outline" : "destructive"}
										className={employee.ativo ? "bg-green-600 text-white" : ""}
									>
										{employee.ativo ? "Ativo" : "Desativado"}
									</Badge>
								</TableCell>
								<TableCell>
									{format(new Date(employee.criadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
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
											<DropdownMenuItem>Ver perfil</DropdownMenuItem>
											<DropdownMenuItem>Ver registros de ponto</DropdownMenuItem>
											<DropdownMenuItem>Ver solicitações</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => {
													setSelectedEmployee(employee)
													setIsEditDialogOpen(true)
												}}
											>Editar colaborador</DropdownMenuItem>
											{employee.ativo ? (
												<DropdownMenuItem
													className="text-destructive"
													onClick={() => toggleActive(employee)}
												>
													Desativar
												</DropdownMenuItem>
											) : (
												<DropdownMenuItem
													className="text-green-700"
													onClick={() => toggleActive(employee)}
												>
													Ativar
												</DropdownMenuItem>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
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

			<EditCollaboratorDialog 
				employee={selectedEmployee}
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
				onSave={fetchColaboradores}
			/>
		</>
	)
})
