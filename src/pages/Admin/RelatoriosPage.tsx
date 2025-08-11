import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, CalendarIcon, User } from "lucide-react"
import { GenerateReportDialog } from "@/components/admin/GenerateReportDialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import api from "@/services/api"

type EntryType = "ENTRADA" | "PAUSA" | "RETOMADA" | "SAIDA"

type Marcacao = {
	tipo: EntryType
	horario: string
}

type Employee = {
	nome: string
	status: string
	marcacoes: Marcacao[]
}

const calculateWorkedHours = (marcacoes: Marcacao[]) => {
	const entrada = marcacoes.find(m => m.tipo === "ENTRADA" && m.horario !== "--:--")
	const saida = marcacoes.find(m => m.tipo === "SAIDA" && m.horario !== "--:--")

	if (entrada && saida) {
		const [entradaHours, entradaMinutes] = entrada.horario.split(':').map(Number)
		const [saidaHours, saidaMinutes] = saida.horario.split(':').map(Number)

		if (
			!isNaN(entradaHours) && !isNaN(entradaMinutes) &&
			!isNaN(saidaHours) && !isNaN(saidaMinutes)
		) {
			const dataBase = new Date()
			const entradaDate = new Date(dataBase)
			entradaDate.setHours(entradaHours, entradaMinutes, 0, 0)

			const saidaDate = new Date(dataBase)
			saidaDate.setHours(saidaHours, saidaMinutes, 0, 0)

			const diffMs = saidaDate.getTime() - entradaDate.getTime()
			const diffMinutes = Math.floor(diffMs / 1000 / 60)

			if (diffMinutes >= 0) {
				const hours = Math.floor(diffMinutes / 60)
				const minutes = diffMinutes % 60
				return `${hours}h ${minutes}min`
			}
		}
	}

	return null
}

function getEntryTypeInfo(type: EntryType) {
	switch (type) {
		case "ENTRADA":
			return {
				color: "main-green-color",
				icon: <i className="fa-solid fa-door-open text-3xl opacity-50"></i>
			};
		case "PAUSA":
			return {
				color: "main-blue-color",
				icon: <i className="fa-solid fa-mug-hot text-3xl opacity-50"></i>
			};
		case "RETOMADA":
			return {
				color: "main-yellow-color",
				icon: <i className="fa-solid fa-battery-full text-3xl opacity-50"></i>
			};
		case "SAIDA":
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
	const [feriasStartDate, setFeriasStartDate] = useState<Date>()
	const [feriasEndDate, setFeriasEndDate] = useState<Date>()	
	const [folgasDate, setFolgasDate] = useState<Date>()

	const [faltasDate, setFaltasDate] = useState<Date>()
	const [faltasStatus, setFaltasStatus] = useState<string>("todos")
	const [faltasTipo, setFaltasTipo] = useState<string>("todos")
	const [faltasTableData, setFaltasTableData] = useState<any[]>([])

	const [attendanceData, setAttendanceData] = useState<Employee[]>([])

	const [feriasStatus, setFeriasStatus] = useState("todos")
	const [feriasTableData, setFeriasTableData] = useState([])

	const fetchAttendanceData = async (date?: Date) => {
		try {
			const params = date ? { params: { data: date.toISOString().split('T')[0] } } : {}

			const response = await api.get('/marcacoes/marcacoes-por-dia', params)
			setAttendanceData(response.data)
		} catch (err) {
			console.error(err)
		}
	}

	const fetchFaltasData = async () => {
		try {
			const params: any = {}
			if (faltasDate) {
				params.data = faltasDate.toISOString().split('T')[0]
			}
			if (faltasStatus !== "todos") {
				params.justificado = faltasStatus === "justificada"
			}
			if (faltasTipo !== "todos") {
				params.tipo = faltasTipo === "ausencia" ? "Ausencia" : "Atraso"
			}

			const response = await api.get('/falta/filtro', { params })
			setFaltasTableData(response.data)
		} catch (err) {
			console.error(err)
		}
	}

	const fetchFeriasData = async () => {
		try {
			const params: any = {}

			if (feriasStartDate && feriasEndDate) {
				params.dataInicio = feriasStartDate.toISOString().split("T")[0]
				params.dataFim = feriasEndDate.toISOString().split("T")[0]
			}

			if (feriasStatus !== "todos") {
				if (feriasStatus === "agendadas") params.statusFiltro = "AGENDADA"
				if (feriasStatus === "concluidas") params.statusFiltro = "CONCLUIDA"
			}

			const response = await api.get("/api/ferias/todas", { params })
			const mapped = response.data.map((item: any) => ({
				id: item.id || item.nomeColaborador + item.dataInicio,
				employee: item.nomeColaborador,
				startDate: format(new Date(item.dataInicio), "dd/MM/yyyy"),
				endDate: format(new Date(item.dataFim), "dd/MM/yyyy"),
				days: item.diasTotais,
				status: item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase(),
				type: item.status === "CONCLUIDA" ? "Passada" : "Futura",
			}))
			setFeriasTableData(mapped)
		} catch (err) {
			console.error("Erro ao buscar dados de férias:", err)
		}
	}

	useEffect(() => {
		fetchAttendanceData(presencaDate)
	}, [presencaDate])

	useEffect(() => {
		fetchFaltasData()
	}, [faltasDate, faltasStatus, faltasTipo])

	const handleGenerateReport = (type: string) => {
		setReportType(type)
		setIsReportDialogOpen(true)
	}

	useEffect(() => {
		if (feriasStartDate && feriasEndDate) {
			fetchFeriasData()
		}
	}, [feriasStartDate, feriasEndDate, feriasStatus])

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
							<Card key={employee.nome} className="overflow-hidden">
								<CardContent className="p-6">
									<div className="flex justify-between items-center mb-4">
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
												<User className="h-4 w-4" />
											</div>
											<span className="font-medium text-lg">{employee.nome}</span>
										</div>
										<div className="text-right">
											{employee.status === "PRESENTE" && employee.marcacoes.length > 0 && (
												<div className="text-lg font-semibold">
													{calculateWorkedHours(employee.marcacoes)}
												</div>
											)}
											<Badge
												variant={
													employee.status === "PRESENTE"
														? "success"
														: employee.status === "AUSENTE"
															? "destructive"
															: "outline"
												}
												className="text-xs mt-1"
											>
												{employee.status}
											</Badge>
										</div>
									</div>

									{employee.status === "PRESENTE" && employee.marcacoes.length > 0 && (
										<div className="flex gap-4 justify-between">
											{employee.marcacoes.map((entry, index) => {
												const { color, icon } = getEntryTypeInfo(entry.tipo)
												return (
													<div key={index} className="flex flex-col items-center">
														<div className={`${color} rounded-full p-4 flex items-center justify-center mb-2`}>
															{icon}
														</div>
														<span className="text-sm font-medium text-center">{entry.horario}</span>
													</div>
												)
											})}
										</div>
									)}

									{(employee.status === "FÉRIAS" || employee.status === "FOLGA") && (
										<div className="flex flex-col items-center py-4">
											<div
												className={`${employee.status === "FÉRIAS" ? "bg-blue-100 dark:bg-blue-900" : "bg-orange-100 dark:bg-orange-900"
													} rounded-full p-6 flex items-center justify-center mb-3`}
											>
												<CalendarIcon
													className={`h-8 w-8 ${employee.status === "FÉRIAS" ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
														}`}
												/>
											</div>
											<div className="text-center">
												<p
													className={`text-sm font-medium ${employee.status === "FÉRIAS" ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
														} mb-1`}
												>
													{employee.status === "FÉRIAS" ? "Em Férias" : "Folga"}
												</p>
												<p className="text-xs text-muted-foreground">{employee.marcacoes[0]?.tipo}</p>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						))}
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
									<label className="text-sm font-medium">Status</label>
									<Select value={faltasStatus} onValueChange={setFaltasStatus}>
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
									<label className="text-sm font-medium">Tipo</label>
									<Select value={faltasTipo} onValueChange={setFaltasTipo}>
										<SelectTrigger>
											<SelectValue placeholder="Selecione o tipo" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="todos">Todos</SelectItem>
											<SelectItem value="ausencia">Ausência</SelectItem>
											<SelectItem value="atraso">Atraso</SelectItem>
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
										</TableRow>
									</TableHeader>
									<TableBody>
										{faltasTableData.length === 0 ? (
											<TableRow>
												<TableCell colSpan={5} className="text-center py-4">
													Não há faltas encontradas.
												</TableCell>
											</TableRow>
										) : (
											faltasTableData.map((falta) => (
												<TableRow key={falta.id}>
													<TableCell className="font-medium">{falta.colaborador?.nome ?? "Desconhecido"}</TableCell>
													<TableCell>{new Date(falta.criadoEm).toLocaleDateString()}</TableCell>
													<TableCell>
														<Badge variant={falta.tipo === "Ausencia" ? "destructive" : "outline"}>
															{falta.tipo}
														</Badge>
													</TableCell>
													<TableCell>
														<Badge variant={falta.justificado ? "success" : "destructive"}>
															{falta.justificado ? "Justificada" : "Injustificada"}
														</Badge>
													</TableCell>
												</TableRow>
											))
										)}
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
									<label className="text-sm font-medium">Data Início</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn("w-full justify-start text-left font-normal", !feriasStartDate && "text-muted-foreground")}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{feriasStartDate ? format(feriasStartDate, "PPP", { locale: ptBR }) : "Selecionar data de início"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={feriasStartDate}
												onSelect={setFeriasStartDate}
												initialFocus
												locale={ptBR}
											/>
										</PopoverContent>
									</Popover>
								</div>

								<div className="flex flex-col gap-2">
									<label className="text-sm font-medium">Data Fim</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn("w-full justify-start text-left font-normal", !feriasEndDate && "text-muted-foreground")}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{feriasEndDate ? format(feriasEndDate, "PPP", { locale: ptBR }) : "Selecionar data de fim"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={feriasEndDate}
												onSelect={setFeriasEndDate}
												initialFocus
												locale={ptBR}
											/>
										</PopoverContent>
									</Popover>
								</div>							</div>
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
