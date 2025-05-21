import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BatteryPlus, ChevronLeft, ChevronRight, Coffee, DoorOpen, Edit, LogOut, MoreHorizontal, Trash2 } from "lucide-react"
import { EditTimeEntryDialog } from "./EditTimeEntryDialog"
import { DeleteTimeEntryDialog } from "./DeleteTimeEntryDialog"
import api from "@/services/api"
import { formatUSDateToBR, formatUSTimeToBR } from "@/utils/formatter"

export type EntryType = "entrada" | "saida_almoco" | "retorno_almoco" | "saida"

export interface TimeEntry {
	id: number
	employeeId: number
	employeeName: string
	employeeAvatar: string
	employeeInitials: string
	type: EntryType
	time: string
	date: string
}

interface MarcacaoResponseDTO {
	id: string
	colaboradorId: number
	nomeColaborador: string
	tipo: "ENTRADA" | "PAUSA" | "RETOMADA" | "SAIDA"
	dataHora: string
	processada: boolean
}

export function getEntryTypeInfo(type: EntryType) {
	switch (type) {
		case "entrada":
			return { color: "bg-green-500", icon: <DoorOpen className="h-5 w-5" />, name: "Entrada" }
		case "retorno_almoco":
			return { color: "bg-yellow-400", icon: <BatteryPlus className="h-5 w-5" />, name: "Retomada" }
		case "saida_almoco":
			return { color: "bg-blue-500", icon: <Coffee className="h-5 w-5" />, name: "Pausa" }
		case "saida":
			return { color: "bg-red-500", icon: <LogOut className="h-5 w-5" />, name: "Saída" }
	}
}

export function TimeEntriesTable() {
	const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
	const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
	const [deletingEntry, setDeletingEntry] = useState<TimeEntry | null>(null)
	const [currentPage, setCurrentPage] = useState(1)

	const itemsPerPage = 15
	const totalPages = Math.ceil(timeEntries.length / itemsPerPage)
	const paginatedEntries = timeEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await api.get<MarcacaoResponseDTO[]>("/marcacoes/com-nome")
				const mappedEntries: TimeEntry[] = response.data.map((m, index) => {
					let entryType: EntryType
					switch (m.tipo) {
						case "ENTRADA": entryType = "entrada"; break
						case "PAUSA": entryType = "saida_almoco"; break
						case "RETOMADA": entryType = "retorno_almoco"; break
						case "SAIDA": entryType = "saida"; break
						default: entryType = "entrada"
					}

					const dateObj = new Date(m.dataHora)

					return {
						id: index + 1,
						employeeId: m.colaboradorId,
						employeeName: m.nomeColaborador,
						employeeAvatar: "/placeholder-user.jpg",
						employeeInitials: m.nomeColaborador.split(" ").map(n => n[0]).join("").slice(0, 2),
						type: entryType,
						time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
						date: dateObj.toLocaleDateString(),
					}
				})
				setTimeEntries(mappedEntries)
			} catch (error) {
				console.error("Erro ao buscar marcações:", error)
			}
		}
		fetchData()
	}, [])

	const handleDelete = (entryId: number) => {
		setTimeEntries(prev => prev.filter(entry => entry.id !== entryId))
		setDeletingEntry(null)
	}

	const handleEdit = (updatedEntry: TimeEntry) => {
		setTimeEntries(prev => prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry)))
		setEditingEntry(null)
	}

	const handlePageChange = (page: number) => setCurrentPage(page)

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Colaborador</TableHead>
							<TableHead>Tipo</TableHead>
							<TableHead>Data</TableHead>
							<TableHead>Hora</TableHead>
							<TableHead className="text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedEntries.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="h-24 text-center">
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
										<TableCell>
											<div className="flex items-center gap-2">
												<div className={`${color} rounded-full p-2 flex items-center justify-center`}>{icon}</div>
												<span>{name}</span>
											</div>
										</TableCell>
										<TableCell>{formatUSDateToBR(entry.date)}</TableCell>
										<TableCell>{formatUSTimeToBR(entry.time)}</TableCell>
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
					<Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
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
					<Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
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
