import { useEffect, useState } from "react"
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

type Colaborador = {
	id: number
	nome: string
	email: string
	ativo: boolean
	criadoEm: string
}

export function EmployeesTable() {
	const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 15

	useEffect(() => {
		const fetchColaboradores = async () => {
			try {
				const response = await api.get("/colaborador")
				setColaboradores(response.data)
			} catch (error) {
				console.error("Erro ao buscar colaboradores:", error)
			}
		}
		fetchColaboradores()
	}, [])

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
											<DropdownMenuItem>Editar colaborador</DropdownMenuItem>
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
		</>
	)
}
