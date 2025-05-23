import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Coffee, DoorOpen, Edit, LogOut, MoreHorizontal, Trash2 } from "lucide-react"
import { EditTimeEntryDialog } from "./EditTimeEntryDialog"
import { DeleteTimeEntryDialog } from "./DeleteTimeEntryDialog"

export type EntryType = "entrada" | "saida_almoco" | "retorno_almoco" | "saida"

export interface TimeEntry {
	id: number
	employeeId: number
	employeeName: string
	employeeAvatar: string
	employeeInitials: string
	department: string
	type: EntryType
	time: string
	date: string
	createdBy: string
	createdAt: string
	modifiedBy?: string
	modifiedAt?: string
}

const timeEntriesData: TimeEntry[] = [
	{
		id: 1,
		employeeId: 1,
		employeeName: "Ana Silva",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "AS",
		department: "TI",
		type: "entrada",
		time: "08:00",
		date: "26/04/2025",
		createdBy: "Sistema",
		createdAt: "26/04/2025 08:00",
	},
	{
		id: 2,
		employeeId: 1,
		employeeName: "Ana Silva",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "AS",
		department: "TI",
		type: "saida_almoco",
		time: "12:01",
		date: "26/04/2025",
		createdBy: "Sistema",
		createdAt: "26/04/2025 12:01",
	},
	{
		id: 3,
		employeeId: 1,
		employeeName: "Ana Silva",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "AS",
		department: "TI",
		type: "retorno_almoco",
		time: "13:03",
		date: "26/04/2025",
		createdBy: "Sistema",
		createdAt: "26/04/2025 13:03",
	},
	{
		id: 4,
		employeeId: 1,
		employeeName: "Ana Silva",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "AS",
		department: "TI",
		type: "saida",
		time: "17:05",
		date: "26/04/2025",
		createdBy: "Sistema",
		createdAt: "26/04/2025 17:05",
	},
	{
		id: 5,
		employeeId: 2,
		employeeName: "Carlos Oliveira",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "CO",
		department: "RH",
		type: "entrada",
		time: "08:15",
		date: "26/04/2025",
		createdBy: "Sistema",
		createdAt: "26/04/2025 08:15",
	},
	{
		id: 6,
		employeeId: 2,
		employeeName: "Carlos Oliveira",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "CO",
		department: "RH",
		type: "saida_almoco",
		time: "12:00",
		date: "26/04/2025",
		createdBy: "Sistema",
		createdAt: "26/04/2025 12:00",
	},
	{
		id: 7,
		employeeId: 3,
		employeeName: "Mariana Santos",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "MS",
		department: "Marketing",
		type: "entrada",
		time: "09:00",
		date: "26/04/2025",
		createdBy: "Sistema",
		createdAt: "26/04/2025 09:00",
		modifiedBy: "Admin",
		modifiedAt: "26/04/2025 09:30",
	},
	{
		id: 8,
		employeeId: 4,
		employeeName: "Pedro Costa",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "PC",
		department: "Financeiro",
		type: "entrada",
		time: "08:30",
		date: "26/04/2025",
		createdBy: "Admin",
		createdAt: "26/04/2025 10:00",
	},
	{
		id: 9,
		employeeId: 5,
		employeeName: "Juliana Lima",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "JL",
		department: "Vendas",
		type: "entrada",
		time: "08:45",
		date: "26/04/2025",
		createdBy: "Sistema",
		createdAt: "26/04/2025 08:45",
	},
	{
		id: 10,
		employeeId: 6,
		employeeName: "Roberto Almeida",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "RA",
		department: "TI",
		type: "entrada",
		time: "08:10",
		date: "26/04/2025",
		createdBy: "Sistema",
		createdAt: "26/04/2025 08:10",
	},
	{
		id: 11,
		employeeId: 7,
		employeeName: "Fernanda Gomes",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "FG",
		department: "Marketing",
		type: "entrada",
		time: "09:15",
		date: "26/04/2025",
		createdBy: "Sistema",
		createdAt: "26/04/2025 09:15",
	},
	{
		id: 12,
		employeeId: 8,
		employeeName: "Lucas Mendes",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "LM",
		department: "Financeiro",
		type: "entrada",
		time: "08:05",
		date: "26/04/2025",
		createdBy: "Sistema",
		createdAt: "26/04/2025 08:05",
	},
]

export function getEntryTypeInfo(type: EntryType) {
	switch (type) {
		case "entrada":
			return {
				color: "bg-green-500",
				icon: <DoorOpen className="h-4 w-4" />,
				name: "Entrada",
			}
		case "saida_almoco":
			return {
				color: "bg-yellow-400",
				icon: <Coffee className="h-4 w-4" />,
				name: "Saída para Almoço",
			}
		case "retorno_almoco":
			return {
				color: "bg-blue-500",
				icon: <Coffee className="h-4 w-4" />,
				name: "Retorno do Almoço",
			}
		case "saida":
			return {
				color: "bg-red-500",
				icon: <LogOut className="h-4 w-4" />,
				name: "Saída",
			}
	}
}

export function TimeEntriesTable() {
	const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(timeEntriesData)
	const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
	const [deletingEntry, setDeletingEntry] = useState<TimeEntry | null>(null)

	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 5
	const totalPages = Math.ceil(timeEntries.length / itemsPerPage)

	const paginatedEntries = timeEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

	const handleDelete = (entryId: number) => {
		setTimeEntries(timeEntries.filter((entry) => entry.id !== entryId))
		setDeletingEntry(null)
	}

	const handleEdit = (updatedEntry: TimeEntry) => {
		setTimeEntries(timeEntries.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)))
		setEditingEntry(null)
	}

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
							<TableHead>Tipo</TableHead>
							<TableHead>Data</TableHead>
							<TableHead>Hora</TableHead>
							<TableHead>Criado por</TableHead>
							<TableHead>Modificado</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedEntries.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="h-24 text-center">
									Nenhuma marcação encontrada.
								</TableCell>
							</TableRow>
						) : (
							paginatedEntries.map((entry) => {
								const { color, icon, name } = getEntryTypeInfo(entry.type)

								return (
									<TableRow key={entry.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-8 w-8">
													<AvatarFallback>{entry.employeeInitials}</AvatarFallback>
												</Avatar>
												<span className="font-medium">{entry.employeeName}</span>
											</div>
										</TableCell>
										<TableCell>{entry.department}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<div className={`${color} rounded-full p-1 flex items-center justify-center`}>{icon}</div>
												<span>{name}</span>
											</div>
										</TableCell>
										<TableCell>{entry.date}</TableCell>
										<TableCell>{entry.time}</TableCell>
										<TableCell>{entry.createdBy}</TableCell>
										<TableCell>
											{entry.modifiedBy ? (
												<Badge variant="outline" className="font-normal">
													{entry.modifiedBy} ({entry.modifiedAt})
												</Badge>
											) : (
												<span className="text-muted-foreground">-</span>
											)}
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
													<DropdownMenuItem onClick={() => setEditingEntry(entry)}>
														<Edit className="mr-2 h-4 w-4" />
														<span>Editar</span>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => setDeletingEntry(entry)}
														className="text-destructive focus:text-destructive"
													>
														<Trash2 className="mr-2 h-4 w-4" />
														<span>Excluir</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								)
							})
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

			{editingEntry && (
				<EditTimeEntryDialog
					entry={editingEntry}
					open={!!editingEntry}
					onOpenChange={(open) => !open && setEditingEntry(null)}
					onSave={handleEdit}
				/>
			)}

			{deletingEntry && (
				<DeleteTimeEntryDialog
					entry={deletingEntry}
					open={!!deletingEntry}
					onOpenChange={(open) => !open && setDeletingEntry(null)}
					onDelete={() => handleDelete(deletingEntry.id)}
				/>
			)}
		</>
	)
}
