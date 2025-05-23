import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText } from "lucide-react"

export default function RelatoriosPage() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
				<p className="text-muted-foreground">Gere e exporte relatórios do sistema de ponto.</p>
			</div>
			<Tabs defaultValue="presenca" className="space-y-4">
				<TabsList>
					<TabsTrigger value="presenca">Presença</TabsTrigger>
					<TabsTrigger value="ausencias">Ausências</TabsTrigger>
					<TabsTrigger value="ferias">Férias</TabsTrigger>
					<TabsTrigger value="horas">Banco de Horas</TabsTrigger>
				</TabsList>
				<TabsContent value="presenca" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Relatório de Presença</CardTitle>
							<CardDescription>Gere relatórios de presença dos colaboradores.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
								</div>
								<div className="flex justify-end">
									<Button>
										<Download className="mr-2 h-4 w-4" />
										Gerar Relatório
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
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
				<TabsContent value="ausencias" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Relatório de Ausências</CardTitle>
							<CardDescription>Gere relatórios de ausências dos colaboradores.</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Conteúdo do relatório de ausências será exibido aqui.</p>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="ferias" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Relatório de Férias</CardTitle>
							<CardDescription>Gere relatórios de férias dos colaboradores.</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Conteúdo do relatório de férias será exibido aqui.</p>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="horas" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Relatório de Banco de Horas</CardTitle>
							<CardDescription>Gere relatórios de banco de horas dos colaboradores.</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Conteúdo do relatório de banco de horas será exibido aqui.</p>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
