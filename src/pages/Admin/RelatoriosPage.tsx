import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, CalendarIcon, User, Coffee, DoorOpen, LogOut } from "lucide-react"
import { GenerateReportDialog } from "@/components/admin/GenerateReportDialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

type EntryType = "entrada" | "saida_almoco" | "retorno_almoco" | "saida"

interface TimeEntry {
	type: EntryType
	time: string
	duration: string
}

interface VacationInfo {
	startDate: string
	endDate: string
	daysRemaining: number
}

interface DayOffInfo {
	reason: string
	date: string
}

interface AbsenceInfo {
	type: string
	date: string
}

interface EmployeeAttendance {
	id: number
	name: string
	initials: string
	totalHours: string
	status: "Presente" | "Ausente" | "Férias" | "Folga"
	entries: TimeEntry[]
	vacationInfo?: VacationInfo
	dayOffInfo?: DayOffInfo
	absenceInfo?: AbsenceInfo
}

const attendanceData: EmployeeAttendance[] = [
	{
		id: 1,
		name: "Ana Silva",
		initials: "AS",
		totalHours: "07h:24min",
		status: "Presente",
		entries: [
			{ type: "entrada", time: "08:00", duration: "04h:01min" },
			{ type: "saida_almoco", time: "12:01", duration: "01h:02min" },
			{ type: "retorno_almoco", time: "13:03", duration: "01h:02min" },
			{ type: "saida", time: "17:24", duration: "01h:02min" },
		],
	},
	{
		id: 2,
		name: "Carlos Oliveira",
		initials: "CO",
		totalHours: "07h:24min",
		status: "Presente",
		entries: [
			{ type: "entrada", time: "08:15", duration: "03h:45min" },
			{ type: "saida_almoco", time: "12:00", duration: "01h:00min" },
			{ type: "retorno_almoco", time: "13:00", duration: "01h:02min" },
			{ type: "saida", time: "17:24", duration: "01h:02min" },
		],
	},
	{
		id: 3,
		name: "Mariana Santos",
		initials: "MS",
		totalHours: "03h:00min",
		status: "Presente",
		entries: [{ type: "entrada", time: "09:00", duration: "03h:00min" }],
	},
	{
		id: 4,
		name: "Pedro Costa",
		initials: "PC",
		totalHours: "08h:15min",
		status: "Presente",
		entries: [
			{ type: "entrada", time: "07:45", duration: "04h:15min" },
			{ type: "saida_almoco", time: "12:00", duration: "01h:00min" },
			{ type: "retorno_almoco", time: "13:00", duration: "04h:15min" },
			{ type: "saida", time: "17:15", duration: "01h:00min" },
		],
	},
	{
		id: 5,
		name: "Juliana Lima",
		initials: "JL",
		totalHours: "00h:00min",
		status: "Férias",
		entries: [],
		vacationInfo: {
			startDate: "15/04/2025",
			endDate: "29/04/2025",
			daysRemaining: 10,
		},
	},
	{
		id: 6,
		name: "Roberto Almeida",
		initials: "RA",
		totalHours: "06h:30min",
		status: "Presente",
		entries: [
			{ type: "entrada", time: "08:30", duration: "03h:30min" },
			{ type: "saida_almoco", time: "12:00", duration: "01h:30min" },
			{ type: "retorno_almoco", time: "13:30", duration: "03h:00min" },
		],
	},
	{
		id: 7,
		name: "Fernanda Gomes",
		initials: "FG",
		totalHours: "00h:00min",
		status: "Folga",
		entries: [],
		dayOffInfo: {
			reason: "Folga Compensatória",
			date: "25/04/2025",
		},
	},
	{
		id: 8,
		name: "Lucas Mendes",
		initials: "LM",
		totalHours: "00h:00min",
		status: "Ausente",
		entries: [],
		absenceInfo: {
			type: "Falta Injustificada",
			date: "25/04/2025",
		},
	},
]

function getEntryTypeInfo(type: EntryType) {
	switch (type) {
		case "entrada":
			return { 
				color: "main-green-color", 
				icon: <i className="fa-solid fa-door-open text-3xl opacity-50"></i> 
			};
		case "saida_almoco":
			return { 
				color: "main-blue-color", 
				icon: <i className="fa-solid fa-mug-hot text-3xl opacity-50"></i> 
			};
		case "retorno_almoco":
			return { 
				color: "main-yellow-color", 
				icon: <i className="fa-solid fa-battery-full text-3xl opacity-50"></i> 
			};
		case "saida":
			return { 
				color: "main-red-color", 
				icon: <i className="fa-solid fa-door-closed text-3xl opacity-50"></i> 
			};
		default:
			return { 
				color: "main-gray-color", 
				icon: <i className="fa-solid fa-question text-3xl opacity-50"></i> 
			};
	}
}


const faltasTableData = [
	{
		id: 1,
		employee: "Ana Silva",
		date: "15/04/2025",
		type: "Falta Injustificada",
		status: "Registrada",
		justification: "-",
	},
	{
		id: 2,
		employee: "Carlos Oliveira",
		date: "12/04/2025",
		type: "Falta Médica",
		status: "Justificada",
		justification: "Atestado médico apresentado",
	},
	{
		id: 3,
		employee: "Pedro Costa",
		date: "10/04/2025",
		type: "Falta Injustificada",
		status: "Registrada",
		justification: "-",
	},
	{
		id: 4,
		employee: "Mariana Santos",
		date: "08/04/2025",
		type: "Falta Familiar",
		status: "Justificada",
		justification: "Problema familiar urgente",
	},
]

const feriasTableData = [
	{
		id: 1,
		employee: "Ana Silva",
		startDate: "01/06/2025",
		endDate: "20/06/2025",
		days: 20,
		status: "Agendada",
		type: "Futura",
	},
	{
		id: 2,
		employee: "Carlos Oliveira",
		startDate: "15/03/2025",
		endDate: "29/03/2025",
		days: 15,
		status: "Concluída",
		type: "Passada",
	},
	{
		id: 3,
		employee: "Mariana Santos",
		startDate: "05/08/2025",
		endDate: "19/08/2025",
		days: 15,
		status: "Agendada",
		type: "Futura",
	},
	{
		id: 4,
		employee: "Pedro Costa",
		startDate: "10/02/2025",
		endDate: "24/02/2025",
		days: 15,
		status: "Concluída",
		type: "Passada",
	},
	{
		id: 5,
		employee: "Juliana Lima",
		startDate: "15/07/2025",
		endDate: "29/07/2025",
		days: 15,
		status: "Agendada",
		type: "Futura",
	},
]

const folgasTableData = [
	{
		id: 1,
		employee: "Pedro Costa",
		date: "30/04/2025",
		reason: "Folga Compensatória",
		status: "Agendada",
		type: "Futura",
	},
	{
		id: 2,
		employee: "Juliana Lima",
		date: "25/03/2025",
		reason: "Aniversário",
		status: "Concluída",
		type: "Passada",
	},
	{
		id: 3,
		employee: "Lucas Mendes",
		date: "05/05/2025",
		reason: "Folga Compensatória",
		status: "Agendada",
		type: "Futura",
	},
	{
		id: 4,
		employee: "Roberto Almeida",
		date: "20/03/2025",
		reason: "Folga Médica",
		status: "Concluída",
		type: "Passada",
	},
	{
		id: 5,
		employee: "Fernanda Gomes",
		date: "12/05/2025",
		reason: "Folga Pessoal",
		status: "Agendada",
		type: "Futura",
	},
]

export default function RelatoriosPage() {
	const [activeTab, setActiveTab] = useState("presenca")
	const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
	const [reportType, setReportType] = useState<string>("")

	const [presencaDate, setPresencaDate] = useState<Date>()
	const [faltasDate, setFaltasDate] = useState<Date>()
	const [feriasDate, setFeriasDate] = useState<Date>()
	const [folgasDate, setFolgasDate] = useState<Date>()

	const handleGenerateReport = (type: string) => {
		setReportType(type)
		setIsReportDialogOpen(true)
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
				<p className="text-muted-foreground">Gere e exporte relatórios do sistema de ponto.</p>
			</div>

			<Tabs defaultValue="presenca" className="space-y-4" onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value="presenca">Presença</TabsTrigger>
					<TabsTrigger value="faltas">Faltas</TabsTrigger>
					<TabsTrigger value="ferias">Férias</TabsTrigger>
					<TabsTrigger value="folgas">Folgas</TabsTrigger>
				</TabsList>

				<TabsContent value="presenca" className="space-y-4">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Relatório de Presença</CardTitle>
									<CardDescription>Visualize e gere relatórios de presença dos colaboradores.</CardDescription>
								</div>
								<Button onClick={() => handleGenerateReport("presenca")}>
									<Download className="mr-2 h-4 w-4" />
									Gerar Relatório
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
									<div className="flex flex-col gap-2">
										<label htmlFor="report-type" className="text-sm font-medium">
											Tipo de Relatório
										</label>
										<Select defaultValue="mensal">
											<SelectTrigger id="report-type">
												<SelectValue placeholder="Selecione o tipo" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="diario">Diário</SelectItem>
												<SelectItem value="semanal">Semanal</SelectItem>
												<SelectItem value="mensal">Mensal</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="flex flex-col gap-2">
										<label htmlFor="department" className="text-sm font-medium">
											Departamento
										</label>
										<Select defaultValue="todos">
											<SelectTrigger id="department">
												<SelectValue placeholder="Selecione o departamento" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="todos">Todos</SelectItem>
												<SelectItem value="ti">TI</SelectItem>
												<SelectItem value="rh">RH</SelectItem>
												<SelectItem value="financeiro">Financeiro</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="flex flex-col gap-2">
										<label htmlFor="format" className="text-sm font-medium">
											Formato
										</label>
										<Select defaultValue="pdf">
											<SelectTrigger id="format">
												<SelectValue placeholder="Selecione o formato" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="pdf">PDF</SelectItem>
												<SelectItem value="excel">Excel</SelectItem>
												<SelectItem value="csv">CSV</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-sm font-medium">Data</label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className={cn(
														"w-full justify-start text-left font-normal",
														!presencaDate && "text-muted-foreground",
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{presencaDate ? format(presencaDate, "PPP", { locale: ptBR }) : "Selecionar data"}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={presencaDate}
													onSelect={setPresencaDate}
													initialFocus
													locale={ptBR}
												/>
											</PopoverContent>
										</Popover>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
						{attendanceData.map((employee) => (
							<Card key={employee.id} className="overflow-hidden">
								<CardContent className="p-6">
									<div className="flex justify-between items-center mb-4">
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
												<User className="h-4 w-4" />
											</div>
											<span className="font-medium text-lg">{employee.name}</span>
										</div>
										<div className="text-right">
											<div className="text-lg font-semibold">{employee.totalHours}</div>
											<Badge
												variant={
													employee.status === "Presente"
														? "success"
														: employee.status === "Ausente"
															? "destructive"
															: "outline"
												}
												className="text-xs mt-1"
											>
												{employee.status}
											</Badge>
										</div>
									</div>

									{employee.status === "Presente" && employee.entries.length > 0 && (
										<div className="flex gap-4 justify-between">
											{employee.entries.map((entry, index) => {
												const { color, icon } = getEntryTypeInfo(entry.type)
												return (
													<div key={index} className="flex flex-col items-center">
														<div className={`${color} rounded-full p-4 flex items-center justify-center mb-2`}>
															{icon}
														</div>
														<span className="text-sm font-medium text-center">{entry.duration}</span>
													</div>
												)
											})}
										</div>
									)}

									{employee.status === "Férias" && employee.vacationInfo && (
										<div className="flex flex-col items-center py-4">
											<div className="bg-blue-100 dark:bg-blue-900 rounded-full p-6 flex items-center justify-center mb-3">
												<CalendarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
											</div>
											<div className="text-center">
												<p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Em Férias</p>
												<p className="text-xs text-muted-foreground">
													{employee.vacationInfo.startDate} - {employee.vacationInfo.endDate}
												</p>
												<p className="text-xs text-muted-foreground">
													{employee.vacationInfo.daysRemaining} dias restantes
												</p>
											</div>
										</div>
									)}

									{employee.status === "Folga" && employee.dayOffInfo && (
										<div className="flex flex-col items-center py-4">
											<div className="bg-orange-100 dark:bg-orange-900 rounded-full p-6 flex items-center justify-center mb-3">
												<CalendarIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
											</div>
											<div className="text-center">
												<p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">Folga</p>
												<p className="text-xs text-muted-foreground">{employee.dayOffInfo.reason}</p>
												<p className="text-xs text-muted-foreground">{employee.dayOffInfo.date}</p>
											</div>
										</div>
									)}

									{employee.status === "Ausente" && employee.absenceInfo && (
										<div className="flex flex-col items-center py-4">
											<div className="bg-red-100 dark:bg-red-900 rounded-full p-6 flex items-center justify-center mb-3">
												<User className="h-8 w-8 text-red-600 dark:text-red-400" />
											</div>
											<div className="text-center">
												<p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Ausente</p>
												<p className="text-xs text-muted-foreground">{employee.absenceInfo.type}</p>
												<p className="text-xs text-muted-foreground">{employee.absenceInfo.date}</p>
											</div>
										</div>
									)}

									{employee.status === "Presente" && employee.entries.length === 0 && (
										<div className="text-center text-muted-foreground py-4">
											<span className="text-sm">Nenhum registro hoje</span>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>

					<div className="grid gap-4 md:grid-cols-3">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Relatórios Recentes</CardTitle>
								<FileText className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">12</div>
								<p className="text-xs text-muted-foreground">+2 relatórios nos últimos 7 dias</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Relatórios Agendados</CardTitle>
								<FileText className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">4</div>
								<p className="text-xs text-muted-foreground">Próximo: Relatório Mensal (01/05)</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Espaço Utilizado</CardTitle>
								<FileText className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">1.2 GB</div>
								<p className="text-xs text-muted-foreground">De 5 GB disponíveis</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="faltas" className="space-y-4">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Relatório de Faltas</CardTitle>
									<CardDescription>Visualize e gere relatórios de faltas dos colaboradores.</CardDescription>
								</div>
								<div className="flex gap-2">
									<Button variant="outline" onClick={() => handleGenerateReport("faltas")}>
										<Download className="mr-2 h-4 w-4" />
										Gerar Relatório
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="mb-6 grid gap-4 md:grid-cols-4">
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Data</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!faltasDate && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{faltasDate ? format(faltasDate, "PPP", { locale: ptBR }) : "Selecionar data"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={faltasDate}
												onSelect={setFaltasDate}
												initialFocus
												locale={ptBR}
											/>
										</PopoverContent>
									</Popover>
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Departamento</label>
									<Select defaultValue="todos">
										<SelectTrigger>
											<SelectValue placeholder="Selecione o departamento" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="todos">Todos</SelectItem>
											<SelectItem value="ti">TI</SelectItem>
											<SelectItem value="rh">RH</SelectItem>
											<SelectItem value="financeiro">Financeiro</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Status</label>
									<Select defaultValue="todos">
										<SelectTrigger>
											<SelectValue placeholder="Selecione o status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="todos">Todos</SelectItem>
											<SelectItem value="justificada">Justificada</SelectItem>
											<SelectItem value="injustificada">Injustificada</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Formato</label>
									<Select defaultValue="pdf">
										<SelectTrigger>
											<SelectValue placeholder="Selecione o formato" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pdf">PDF</SelectItem>
											<SelectItem value="excel">Excel</SelectItem>
											<SelectItem value="csv">CSV</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Colaborador</TableHead>
											<TableHead>Data</TableHead>
											<TableHead>Tipo</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Justificativa</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{faltasTableData.map((falta) => (
											<TableRow key={falta.id}>
												<TableCell className="font-medium">{falta.employee}</TableCell>
												<TableCell>{falta.date}</TableCell>
												<TableCell>
													<Badge variant={falta.type === "Falta Injustificada" ? "destructive" : "outline"}>
														{falta.type}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge variant={falta.status === "Justificada" ? "success" : "destructive"}>
														{falta.status}
													</Badge>
												</TableCell>
												<TableCell className="max-w-[200px] truncate">{falta.justification}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="ferias" className="space-y-4">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Relatório de Férias</CardTitle>
									<CardDescription>Visualize e gere relatórios de férias dos colaboradores.</CardDescription>
								</div>
								<div className="flex gap-2">
									<Button variant="outline" onClick={() => handleGenerateReport("ferias")}>
										<Download className="mr-2 h-4 w-4" />
										Gerar Relatório
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="mb-6 grid gap-4 md:grid-cols-4">
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Data</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!feriasDate && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{feriasDate ? format(feriasDate, "PPP", { locale: ptBR }) : "Selecionar data"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={feriasDate}
												onSelect={setFeriasDate}
												initialFocus
												locale={ptBR}
											/>
										</PopoverContent>
									</Popover>
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Departamento</label>
									<Select defaultValue="todos">
										<SelectTrigger>
											<SelectValue placeholder="Selecione o departamento" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="todos">Todos</SelectItem>
											<SelectItem value="ti">TI</SelectItem>
											<SelectItem value="rh">RH</SelectItem>
											<SelectItem value="financeiro">Financeiro</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Período</label>
									<Select defaultValue="todos">
										<SelectTrigger>
											<SelectValue placeholder="Selecione o período" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="todos">Todos</SelectItem>
											<SelectItem value="agendadas">Agendadas</SelectItem>
											<SelectItem value="concluidas">Concluídas</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Formato</label>
									<Select defaultValue="pdf">
										<SelectTrigger>
											<SelectValue placeholder="Selecione o formato" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pdf">PDF</SelectItem>
											<SelectItem value="excel">Excel</SelectItem>
											<SelectItem value="csv">CSV</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="space-y-6">
								<div>
									<div className="flex items-center gap-2 mb-4">
										<CalendarIcon className="h-5 w-5 text-blue-500" />
										<h3 className="text-lg font-semibold">Férias Agendadas</h3>
									</div>
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Colaborador</TableHead>
													<TableHead>Início</TableHead>
													<TableHead>Fim</TableHead>
													<TableHead>Dias</TableHead>
													<TableHead>Status</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{feriasTableData
													.filter((ferias) => ferias.type === "Futura")
													.map((ferias) => (
														<TableRow key={ferias.id}>
															<TableCell className="font-medium">{ferias.employee}</TableCell>
															<TableCell>{ferias.startDate}</TableCell>
															<TableCell>{ferias.endDate}</TableCell>
															<TableCell>{ferias.days} dias</TableCell>
															<TableCell>
																<Badge variant="outline">{ferias.status}</Badge>
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</div>

								<div>
									<div className="flex items-center gap-2 mb-4">
										<CalendarIcon className="h-5 w-5 text-green-500" />
										<h3 className="text-lg font-semibold">Férias Concluídas</h3>
									</div>
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Colaborador</TableHead>
													<TableHead>Início</TableHead>
													<TableHead>Fim</TableHead>
													<TableHead>Dias</TableHead>
													<TableHead>Status</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{feriasTableData
													.filter((ferias) => ferias.type === "Passada")
													.map((ferias) => (
														<TableRow key={ferias.id}>
															<TableCell className="font-medium">{ferias.employee}</TableCell>
															<TableCell>{ferias.startDate}</TableCell>
															<TableCell>{ferias.endDate}</TableCell>
															<TableCell>{ferias.days} dias</TableCell>
															<TableCell>
																<Badge variant="success">{ferias.status}</Badge>
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="folgas" className="space-y-4">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Relatório de Folgas</CardTitle>
									<CardDescription>Visualize e gere relatórios de folgas dos colaboradores.</CardDescription>
								</div>
								<div className="flex gap-2">
									<Button variant="outline" onClick={() => handleGenerateReport("folgas")}>
										<Download className="mr-2 h-4 w-4" />
										Gerar Relatório
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="mb-6 grid gap-4 md:grid-cols-4">
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Data</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!folgasDate && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{folgasDate ? format(folgasDate, "PPP", { locale: ptBR }) : "Selecionar data"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={folgasDate}
												onSelect={setFolgasDate}
												initialFocus
												locale={ptBR}
											/>
										</PopoverContent>
									</Popover>
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Departamento</label>
									<Select defaultValue="todos">
										<SelectTrigger>
											<SelectValue placeholder="Selecione o departamento" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="todos">Todos</SelectItem>
											<SelectItem value="ti">TI</SelectItem>
											<SelectItem value="rh">RH</SelectItem>
											<SelectItem value="financeiro">Financeiro</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Tipo</label>
									<Select defaultValue="todos">
										<SelectTrigger>
											<SelectValue placeholder="Selecione o tipo" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="todos">Todos</SelectItem>
											<SelectItem value="agendadas">Agendadas</SelectItem>
											<SelectItem value="concluidas">Concluídas</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Formato</label>
									<Select defaultValue="pdf">
										<SelectTrigger>
											<SelectValue placeholder="Selecione o formato" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pdf">PDF</SelectItem>
											<SelectItem value="excel">Excel</SelectItem>
											<SelectItem value="csv">CSV</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="space-y-6">
								<div>
									<div className="flex items-center gap-2 mb-4">
										<CalendarIcon className="h-5 w-5 text-blue-500" />
										<h3 className="text-lg font-semibold">Folgas Agendadas</h3>
									</div>
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Colaborador</TableHead>
													<TableHead>Data</TableHead>
													<TableHead>Motivo</TableHead>
													<TableHead>Status</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{folgasTableData
													.filter((folga) => folga.type === "Futura")
													.map((folga) => (
														<TableRow key={folga.id}>
															<TableCell className="font-medium">{folga.employee}</TableCell>
															<TableCell>{folga.date}</TableCell>
															<TableCell>{folga.reason}</TableCell>
															<TableCell>
																<Badge variant="outline">{folga.status}</Badge>
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</div>

								<div>
									<div className="flex items-center gap-2 mb-4">
										<CalendarIcon className="h-5 w-5 text-green-500" />
										<h3 className="text-lg font-semibold">Folgas Concluídas</h3>
									</div>
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Colaborador</TableHead>
													<TableHead>Data</TableHead>
													<TableHead>Motivo</TableHead>
													<TableHead>Status</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{folgasTableData
													.filter((folga) => folga.type === "Passada")
													.map((folga) => (
														<TableRow key={folga.id}>
															<TableCell className="font-medium">{folga.employee}</TableCell>
															<TableCell>{folga.date}</TableCell>
															<TableCell>{folga.reason}</TableCell>
															<TableCell>
																<Badge variant="success">{folga.status}</Badge>
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<GenerateReportDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen} reportType={reportType} />
		</div>
	)
}
