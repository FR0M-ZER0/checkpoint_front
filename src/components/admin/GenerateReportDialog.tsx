import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface GenerateReportDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	reportType: string
}

const employees = [
	{ id: "all", name: "Todos os colaboradores" },
	{ id: "1", name: "Ana Silva" },
	{ id: "2", name: "Carlos Oliveira" },
	{ id: "3", name: "Mariana Santos" },
	{ id: "4", name: "Pedro Costa" },
	{ id: "5", name: "Juliana Lima" },
	{ id: "6", name: "Roberto Almeida" },
	{ id: "7", name: "Fernanda Gomes" },
	{ id: "8", name: "Lucas Mendes" },
]

const reportTypeNames: Record<string, string> = {
	presenca: "Presença",
	faltas: "Faltas",
	ferias: "Férias",
	folgas: "Folgas",
}

export function GenerateReportDialog({ open, onOpenChange, reportType }: GenerateReportDialogProps) {
	const [selectedEmployee, setSelectedEmployee] = useState("all")
	const [fileFormat, setFileFormat] = useState("pdf")
	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Validação básica
		if (!date?.from || !date?.to) {
			return
		}

		// Reset form
		setSelectedEmployee("all")
		setFileFormat("pdf")
		setDate({ from: undefined, to: undefined })

		// Close dialog
		onOpenChange(false)
	}

	const getReportTitle = () => {
		return reportTypeNames[reportType] || "Relatório"
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Gerar Relatório de {getReportTitle()}</DialogTitle>
						<DialogDescription>
							Configure as opções para gerar o relatório de {getReportTitle().toLowerCase()}.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="employee">Colaborador</Label>
							<Select value={selectedEmployee} onValueChange={setSelectedEmployee} required>
								<SelectTrigger id="employee">
									<SelectValue placeholder="Selecione um colaborador" />
								</SelectTrigger>
								<SelectContent>
									{employees.map((employee) => (
										<SelectItem key={employee.id} value={employee.id}>
											{employee.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label>Período</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn("w-full justify-start text-left font-normal", !date?.from && "text-muted-foreground")}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{date?.from ? (
											date.to ? (
												<>
													{format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
													{format(date.to, "dd/MM/yyyy", { locale: ptBR })}
												</>
											) : (
												format(date.from, "dd/MM/yyyy", { locale: ptBR })
											)
										) : (
											"Selecione o período"
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										initialFocus
										mode="range"
										defaultMonth={date?.from}
										selected={date}
										onSelect={setDate}
										numberOfMonths={2}
										locale={ptBR}
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancelar
						</Button>
						<Button type="submit">
							<Download className="mr-2 h-4 w-4" />
							Gerar Relatório
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
