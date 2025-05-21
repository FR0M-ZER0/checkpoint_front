import { useState, useRef } from "react"
import { EmployeesTable, EmployeesTableHandle } from "@/components/admin/EmployeesTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownAZ, ArrowUpAZ, CalendarDays, Plus, Search } from "lucide-react"
import { AddCollaboratorDialog } from "@/components/admin/AddColaboratorDialog"

export default function ColaboradoresPage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [sortBy, setSortBy] = useState("name")
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

	const tableRef = useRef<EmployeesTableHandle>(null)
	const handleEmployeeCreated = () => {
		tableRef.current?.refresh()
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">Colaboradores</h1>
				<p className="text-muted-foreground">Gerencie os colaboradores e seus registros de ponto.</p>
			</div>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Lista de Colaboradores</CardTitle>
							<CardDescription>Visualize e gerencie todos os colaboradores.</CardDescription>
						</div>
						<Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
							<Plus className="mr-2 h-4 w-4" />
							Adicionar Colaborador
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-6 grid gap-4 md:grid-cols-4">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Buscar colaboradores..."
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos os Status</SelectItem>
								<SelectItem value="active">Ativos</SelectItem>
								<SelectItem value="inactive">Inativos</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={`${sortBy}-${sortOrder}`}
							onValueChange={(value) => {
								const [field, order] = value.split("-") as [string, "asc" | "desc"]
								setSortBy(field)
								setSortOrder(order)
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Ordenar por" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="name-asc">
									<div className="flex items-center">
										<ArrowDownAZ className="mr-2 h-4 w-4" />
										Nome (A-Z)
									</div>
								</SelectItem>
								<SelectItem value="name-desc">
									<div className="flex items-center">
										<ArrowUpAZ className="mr-2 h-4 w-4" />
										Nome (Z-A)
									</div>
								</SelectItem>
								<SelectItem value="date-desc">
									<div className="flex items-center">
										<CalendarDays className="mr-2 h-4 w-4" />
										Data (Mais recente)
									</div>
								</SelectItem>
								<SelectItem value="date-asc">
									<div className="flex items-center">
										<CalendarDays className="mr-2 h-4 w-4" />
										Data (Mais antiga)
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<EmployeesTable
						searchQuery={searchQuery}
						statusFilter={statusFilter}
						sortBy={sortBy}
						sortOrder={sortOrder}
						ref={tableRef}
					/>
				</CardContent>
			</Card>

			<AddCollaboratorDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAdd={handleEmployeeCreated} />
		</div>
	)
}
