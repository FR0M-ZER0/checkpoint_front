import { useState } from "react"
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

const employees = [
	{
		id: 1,
		name: "Ana Silva",
		email: "ana.silva@empresa.com",
		department: "TI",
		position: "Desenvolvedora",
		status: "Ativo",
		avatar: "/placeholder-user.jpg",
		initials: "AS",
	},
	{
		id: 2,
		name: "Carlos Oliveira",
		email: "carlos.oliveira@empresa.com",
		department: "RH",
		position: "Analista de RH",
		status: "Ativo",
		avatar: "/placeholder-user.jpg",
		initials: "CO",
	},
	{
		id: 3,
		name: "Mariana Santos",
		email: "mariana.santos@empresa.com",
		department: "Marketing",
		position: "Gerente de Marketing",
		status: "Desativado",
		avatar: "/placeholder-user.jpg",
		initials: "MS",
	},
	{
		id: 4,
		name: "Pedro Costa",
		email: "pedro.costa@empresa.com",
		department: "Financeiro",
		position: "Contador",
		status: "Ativo",
		avatar: "/placeholder-user.jpg",
		initials: "PC",
	},
	{
		id: 5,
		name: "Juliana Lima",
		email: "juliana.lima@empresa.com",
		department: "Vendas",
		position: "Representante de Vendas",
		status: "Férias",
		avatar: "/placeholder-user.jpg",
		initials: "JL",
	},
	{
		id: 6,
		name: "Roberto Almeida",
		email: "roberto.almeida@empresa.com",
		department: "TI",
		position: "Analista de Sistemas",
		status: "Ativo",
		avatar: "/placeholder-user.jpg",
		initials: "RA",
	},
	{
		id: 7,
		name: "Fernanda Gomes",
		email: "fernanda.gomes@empresa.com",
		department: "Marketing",
		position: "Designer",
		status: "Ativo",
		avatar: "/placeholder-user.jpg",
		initials: "FG",
	},
	{
		id: 8,
		name: "Lucas Mendes",
		email: "lucas.mendes@empresa.com",
		department: "Financeiro",
		position: "Analista Financeiro",
		status: "Desativado",
		avatar: "/placeholder-user.jpg",
		initials: "LM",
	},
	{
		id: 9,
		name: "Camila Rocha",
		email: "camila.rocha@empresa.com",
		department: "RH",
		position: "Recrutadora",
		status: "Ativo",
		avatar: "/placeholder-user.jpg",
		initials: "CR",
	},
	{
		id: 10,
		name: "Gabriel Souza",
		email: "gabriel.souza@empresa.com",
		department: "Vendas",
		position: "Gerente de Contas",
		status: "Ativo",
		avatar: "/placeholder-user.jpg",
		initials: "GS",
	},
	{
		id: 11,
		name: "Isabela Martins",
		email: "isabela.martins@empresa.com",
		department: "TI",
		position: "QA Tester",
		status: "Ativo",
		avatar: "/placeholder-user.jpg",
		initials: "IM",
	},
	{
		id: 12,
		name: "Thiago Ferreira",
		email: "thiago.ferreira@empresa.com",
		department: "Marketing",
		position: "Analista de Mídias Sociais",
		status: "Folga",
		avatar: "/placeholder-user.jpg",
		initials: "TF",
	},
]

export function EmployeesTable() {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 5
	const totalPages = Math.ceil(employees.length / itemsPerPage)

	const paginatedEmployees = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Colaborador</TableHead>
							<TableHead>Departamento</TableHead>
							<TableHead>Cargo</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedEmployees.map((employee) => (
							<TableRow key={employee.id}>
								<TableCell>
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarFallback>{employee.initials}</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium">{employee.name}</p>
											<p className="text-sm text-muted-foreground">{employee.email}</p>
										</div>
									</div>
								</TableCell>
								<TableCell>{employee.department}</TableCell>
								<TableCell>{employee.position}</TableCell>
								<TableCell>
									<Badge
										variant={employee.status === "Desativado" ? "destructive" : "outline"}
										className={employee.status === "Ativo" ? "bg-green-600 text-white" : ""}
									>
										{employee.status}
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