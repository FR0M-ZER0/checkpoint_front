import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, Search } from "lucide-react"
import { TimeEntriesTable } from "@/components/admin/TimeEntriesTable"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { AddTimeEntryDialog } from "@/components/admin/AddTimeEntryDialog"

export default function MarcacoesPage() {
	const [date, setDate] = useState<Date>()
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">Marcações de Ponto</h1>
				<p className="text-muted-foreground">Visualize e gerencie todas as marcações de ponto dos colaboradores.</p>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Todas as Marcações</CardTitle>
							<CardDescription>Gerencie os registros de ponto dos colaboradores.</CardDescription>
						</div>
						<Button onClick={() => setIsAddDialogOpen(true)}>
							<Plus className="mr-2 h-4 w-4" />
							Adicionar Marcação
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-6 grid gap-4 md:grid-cols-4">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input type="search" placeholder="Buscar colaborador..." className="pl-8" />
						</div>

						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Tipo de marcação" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todas</SelectItem>
								<SelectItem value="entrada">Entrada</SelectItem>
								<SelectItem value="saida_almoco">Retomada</SelectItem>
								<SelectItem value="retorno_almoco">Pausa</SelectItem>
								<SelectItem value="saida">Saída</SelectItem>
							</SelectContent>
						</Select>

						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Colaborador" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos</SelectItem>
								<SelectItem value="1">Ana Silva</SelectItem>
								<SelectItem value="2">Carlos Oliveira</SelectItem>
								<SelectItem value="3">Mariana Santos</SelectItem>
								<SelectItem value="4">Pedro Costa</SelectItem>
								<SelectItem value="5">Juliana Lima</SelectItem>
								<SelectItem value="6">Roberto Almeida</SelectItem>
								<SelectItem value="7">Fernanda Gomes</SelectItem>
								<SelectItem value="8">Lucas Mendes</SelectItem>
							</SelectContent>
						</Select>

						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? format(date, "PPP", { locale: ptBR }) : "Selecionar data"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ptBR} />
							</PopoverContent>
						</Popover>
					</div>

					<TimeEntriesTable />
				</CardContent>
			</Card>

			<AddTimeEntryDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
		</div>
	)
}
