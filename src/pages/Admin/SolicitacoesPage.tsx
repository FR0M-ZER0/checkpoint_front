import { useState } from "react"
import { RequestsTable } from "@/components/admin/RequestsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

export default function SolicitacoesPage() {
	const [activeTab, setActiveTab] = useState("ajustes")
	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	})

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">Solicitações</h1>
				<p className="text-muted-foreground">Gerencie as solicitações de ajustes, férias e folgas dos colaboradores.</p>
			</div>
			<Tabs defaultValue="ajustes" className="space-y-4" onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value="ajustes">Ajustes de Ponto</TabsTrigger>
					<TabsTrigger value="ferias">Férias</TabsTrigger>
					<TabsTrigger value="folgas">Folgas</TabsTrigger>
					<TabsTrigger value="ausencias">Ausências</TabsTrigger>
				</TabsList>
				<TabsContent value="ajustes" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Solicitações de Ajustes de Ponto</CardTitle>
							<CardDescription>Visualize e aprove solicitações de ajustes de ponto.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-6 grid gap-4 md:grid-cols-4">
								<div className="relative">
									<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input type="search" placeholder="Buscar colaborador..." className="pl-8" />
								</div>

								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todos</SelectItem>
										<SelectItem value="pending">Pendente</SelectItem>
										<SelectItem value="approved">Aprovado</SelectItem>
										<SelectItem value="rejected">Rejeitado</SelectItem>
									</SelectContent>
								</Select>

								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Departamento" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todos</SelectItem>
										<SelectItem value="ti">TI</SelectItem>
										<SelectItem value="rh">RH</SelectItem>
										<SelectItem value="marketing">Marketing</SelectItem>
										<SelectItem value="financeiro">Financeiro</SelectItem>
										<SelectItem value="vendas">Vendas</SelectItem>
									</SelectContent>
								</Select>

								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{date?.from ? (
												date.to ? (
													<>
														{format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
													</>
												) : (
													format(date.from, "dd/MM/yyyy")
												)
											) : (
												"Selecionar período"
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
							<RequestsTable type="ajustes" />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="ferias" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Solicitações de Férias</CardTitle>
							<CardDescription>Visualize e aprove solicitações de férias.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-6 grid gap-4 md:grid-cols-4">
								<div className="relative">
									<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input type="search" placeholder="Buscar colaborador..." className="pl-8" />
								</div>

								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todos</SelectItem>
										<SelectItem value="pending">Pendente</SelectItem>
										<SelectItem value="approved">Aprovado</SelectItem>
										<SelectItem value="rejected">Rejeitado</SelectItem>
									</SelectContent>
								</Select>

								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Departamento" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todos</SelectItem>
										<SelectItem value="ti">TI</SelectItem>
										<SelectItem value="rh">RH</SelectItem>
										<SelectItem value="marketing">Marketing</SelectItem>
										<SelectItem value="financeiro">Financeiro</SelectItem>
										<SelectItem value="vendas">Vendas</SelectItem>
									</SelectContent>
								</Select>

								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{date?.from ? (
												date.to ? (
													<>
														{format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
													</>
												) : (
													format(date.from, "dd/MM/yyyy")
												)
											) : (
												"Selecionar período"
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
							<RequestsTable type="ferias" />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="folgas" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Solicitações de Folgas</CardTitle>
							<CardDescription>Visualize e aprove solicitações de folgas.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-6 grid gap-4 md:grid-cols-4">
								<div className="relative">
									<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input type="search" placeholder="Buscar colaborador..." className="pl-8" />
								</div>

								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todos</SelectItem>
										<SelectItem value="pending">Pendente</SelectItem>
										<SelectItem value="approved">Aprovado</SelectItem>
										<SelectItem value="rejected">Rejeitado</SelectItem>
									</SelectContent>
								</Select>

								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Departamento" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todos</SelectItem>
										<SelectItem value="ti">TI</SelectItem>
										<SelectItem value="rh">RH</SelectItem>
										<SelectItem value="marketing">Marketing</SelectItem>
										<SelectItem value="financeiro">Financeiro</SelectItem>
										<SelectItem value="vendas">Vendas</SelectItem>
									</SelectContent>
								</Select>

								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{date?.from ? (
												date.to ? (
													<>
														{format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
													</>
												) : (
													format(date.from, "dd/MM/yyyy")
												)
											) : (
												"Selecionar período"
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
							<RequestsTable type="folgas" />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="ausencias" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Justificativas de Ausências</CardTitle>
							<CardDescription>Visualize e aprove justificativas de ausências.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-6 grid gap-4 md:grid-cols-4">
								<div className="relative">
									<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input type="search" placeholder="Buscar colaborador..." className="pl-8" />
								</div>

								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todos</SelectItem>
										<SelectItem value="pending">Pendente</SelectItem>
										<SelectItem value="approved">Aprovado</SelectItem>
										<SelectItem value="rejected">Rejeitado</SelectItem>
									</SelectContent>
								</Select>

								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Departamento" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todos</SelectItem>
										<SelectItem value="ti">TI</SelectItem>
										<SelectItem value="rh">RH</SelectItem>
										<SelectItem value="marketing">Marketing</SelectItem>
										<SelectItem value="financeiro">Financeiro</SelectItem>
										<SelectItem value="vendas">Vendas</SelectItem>
									</SelectContent>
								</Select>

								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{date?.from ? (
												date.to ? (
													<>
														{format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
													</>
												) : (
													format(date.from, "dd/MM/yyyy")
												)
											) : (
												"Selecionar período"
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
							<RequestsTable type="ausencias" />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
