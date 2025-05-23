import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/admin/Stats"
import { RecentRequests } from "@/components/admin/RecentRequests"
import { EmployeeActivity } from "@/components/admin/EmployeeActivity"
import { RecentTimeEntries } from "@/components/admin/RecentTimeEntries"

export default function DashboardPage() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">Bem-vindo ao painel administrativo do sistema de ponto.</p>
			</div>
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Visão Geral</TabsTrigger>
					<TabsTrigger value="analytics">Análises</TabsTrigger>
					<TabsTrigger value="reports">Relatórios</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-4">
					<DashboardStats />
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Card className="lg:col-span-4">
							<CardHeader>
								<CardTitle>Solicitações Recentes</CardTitle>
								<CardDescription>Solicitações de ajustes, férias e folgas pendentes.</CardDescription>
							</CardHeader>
							<CardContent>
								<RecentRequests />
							</CardContent>
						</Card>
						<Card className="lg:col-span-3">
							<CardHeader>
								<CardTitle>Atividade dos Colaboradores</CardTitle>
								<CardDescription>Registros de ponto dos últimos 7 dias.</CardDescription>
							</CardHeader>
							<CardContent>
								<EmployeeActivity />
							</CardContent>
						</Card>
					</div>
					<Card>
						<CardHeader>
							<CardTitle>Marcações Recentes</CardTitle>
							<CardDescription>Últimas marcações de ponto dos colaboradores.</CardDescription>
						</CardHeader>
						<CardContent>
							<RecentTimeEntries />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="analytics" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Análises</CardTitle>
							<CardDescription>Análises detalhadas de presença e ausência.</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Nada por enquanto :D</p>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="reports" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Relatórios</CardTitle>
							<CardDescription>Relatórios gerenciais e exportação de dados.</CardDescription>
						</CardHeader>
						<CardContent>
							<p>Nada por enquanto :D</p>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
