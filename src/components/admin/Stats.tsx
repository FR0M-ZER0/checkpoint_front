import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck, Clock, UserCheck, UserX } from "lucide-react"

export function DashboardStats() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Colaboradores Ativos</CardTitle>
					<UserCheck className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">42</div>
					<p className="text-xs text-muted-foreground">+2 desde o último mês</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Faltas/Ausências</CardTitle>
					<UserX className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">8</div>
					<p className="text-xs text-muted-foreground">-1 desde ontem</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
					<ClipboardCheck className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">16</div>
					<p className="text-xs text-muted-foreground">+3 novas solicitações hoje</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Horas Extras (Mês)</CardTitle>
					<Clock className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">124h</div>
					<p className="text-xs text-muted-foreground">+12h desde a semana passada</p>
				</CardContent>
			</Card>
		</div>
	)
}
