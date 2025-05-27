import type React from "react"
import { useEffect, useState } from "react"
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
import api from "@/services/api"

interface GenerateReportDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	reportType: string
}

type Colaborador = {
	id: number
	nome: string
}

const reportTypeNames: Record<string, string> = {
	presenca: "Presença",
	faltas: "Faltas",
	ferias: "Férias",
	folgas: "Folgas",
}

export function GenerateReportDialog({ open, onOpenChange, reportType }: GenerateReportDialogProps) {
	const [selectedEmployee, setSelectedEmployee] = useState("all")
	const [employees, setEmployees] = useState<Colaborador[]>([])
	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	})

	const fetchEmployees = async () => {
		try {
			const response = await api.get('/colaborador')
			setEmployees(response.data)
		} catch (err) {
			console.error(err)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!date?.from) {
			return
		}

		const dataInicio = date.from.toISOString().split("T")[0]
		const dataFim = date.to ? date.to.toISOString().split("T")[0] : dataInicio

		if (reportType === "presenca") {
			const params: Record<string, string> = {
				dataInicio,
				dataFim,
			}

			if (selectedEmployee !== "all") {
				params.colaboradorId = selectedEmployee
			}

			try {
				const response = await api.get("/marcacoes/relatorio-marcacoes", {
					params,
					responseType: "blob",
				})

				const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }))
				const link = document.createElement("a")
				link.href = url
				link.setAttribute("download", `relatorio-${getReportTitle().toLowerCase()}.pdf`)
				document.body.appendChild(link)
				link.click()
				link.remove()
			} catch (error) {
				console.error("Erro ao gerar relatório:", error)
			}
		}

		setSelectedEmployee("all")
		setDate({ from: undefined, to: undefined })

		onOpenChange(false)
	}

	const getReportTitle = () => {
		return reportTypeNames[reportType] || "Relatório"
	}

	useEffect(() => {
		fetchEmployees()
	}, [])

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
								<SelectTrigger>
									<SelectValue placeholder="Selecione um colaborador" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todos</SelectItem>
									{employees.map((employee) => (
										<SelectItem key={employee.id} value={String(employee.id)}>
											{employee.nome}
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
