import { EmployeesTable } from "@/components/admin/EmployeesTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

export default function ColaboradoresPage() {
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
						<Button size="sm">
							<Plus className="mr-2 h-4 w-4" />
							Adicionar Colaborador
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-4 flex items-center gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input type="search" placeholder="Buscar colaboradores..." className="pl-8" />
						</div>
					</div>
					<EmployeesTable />
				</CardContent>
			</Card>
		</div>
	)
}
