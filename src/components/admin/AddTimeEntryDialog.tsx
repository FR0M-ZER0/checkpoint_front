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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getEntryTypeInfo } from "./TimeEntriesTable"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface AddTimeEntryDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

const employees = [
	{ id: 1, name: "Ana Silva", department: "TI" },
	{ id: 2, name: "Carlos Oliveira", department: "RH" },
	{ id: 3, name: "Mariana Santos", department: "Marketing" },
	{ id: 4, name: "Pedro Costa", department: "Financeiro" },
	{ id: 5, name: "Juliana Lima", department: "Vendas" },
]

export function AddTimeEntryDialog({ open, onOpenChange }: AddTimeEntryDialogProps) {
	const [employeeId, setEmployeeId] = useState<string>("")
	const [entryType, setEntryType] = useState<string>("")
	const [date, setDate] = useState<Date>()
	const [time, setTime] = useState<string>("")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		setEmployeeId("")
		setEntryType("")
		setDate(undefined)
		setTime("")


		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Adicionar Marcação de Ponto</DialogTitle>
						<DialogDescription>Adicione uma nova marcação de ponto para um colaborador.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="employee">Colaborador</Label>
							<Select value={employeeId} onValueChange={setEmployeeId} required>
								<SelectTrigger id="employee">
									<SelectValue placeholder="Selecione um colaborador" />
								</SelectTrigger>
								<SelectContent>
									{employees.map((employee) => (
										<SelectItem key={employee.id} value={employee.id.toString()}>
											{employee.name} ({employee.department})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="type">Tipo de Marcação</Label>
							<Select value={entryType} onValueChange={setEntryType} required>
								<SelectTrigger id="type">
									<SelectValue placeholder="Selecione o tipo de marcação" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="entrada">
										<div className="flex items-center gap-2">
											<div className="bg-green-500 rounded-full p-1 flex items-center justify-center">
												{getEntryTypeInfo("entrada").icon}
											</div>
											<span>Entrada</span>
										</div>
									</SelectItem>
									<SelectItem value="saida_almoco">
										<div className="flex items-center gap-2">
											<div className="bg-yellow-400 rounded-full p-1 flex items-center justify-center">
												{getEntryTypeInfo("saida_almoco").icon}
											</div>
											<span>Saída para Almoço</span>
										</div>
									</SelectItem>
									<SelectItem value="retorno_almoco">
										<div className="flex items-center gap-2">
											<div className="bg-blue-500 rounded-full p-1 flex items-center justify-center">
												{getEntryTypeInfo("retorno_almoco").icon}
											</div>
											<span>Retorno do Almoço</span>
										</div>
									</SelectItem>
									<SelectItem value="saida">
										<div className="flex items-center gap-2">
											<div className="bg-red-500 rounded-full p-1 flex items-center justify-center">
												{getEntryTypeInfo("saida").icon}
											</div>
											<span>Saída</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Data</Label>
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

							<div className="grid gap-2">
								<Label htmlFor="time">Hora</Label>
								<div className="relative">
									<Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										id="time"
										type="time"
										value={time}
										onChange={(e) => setTime(e.target.value)}
										className="pl-9"
										required
									/>
								</div>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancelar
						</Button>
						<Button type="submit">Adicionar Marcação</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
