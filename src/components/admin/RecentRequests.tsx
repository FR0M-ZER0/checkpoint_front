import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

const recentRequests = [
	{
		id: 1,
		employee: {
			name: "Ana Silva",
			avatar: "/placeholder-user.jpg",
			initials: "AS",
		},
		type: "Ajuste de Ponto",
		date: "24/04/2025",
		status: "Pendente",
	},
	{
		id: 2,
		employee: {
			name: "Carlos Oliveira",
			avatar: "/placeholder-user.jpg",
			initials: "CO",
		},
		type: "Férias",
		date: "23/04/2025",
		status: "Pendente",
	},
	{
		id: 3,
		employee: {
			name: "Mariana Santos",
			avatar: "/placeholder-user.jpg",
			initials: "MS",
		},
		type: "Folga",
		date: "22/04/2025",
		status: "Pendente",
	},
	{
		id: 4,
		employee: {
			name: "Pedro Costa",
			avatar: "/placeholder-user.jpg",
			initials: "PC",
		},
		type: "Ausência",
		date: "21/04/2025",
		status: "Pendente",
	},
]

export function RecentRequests() {
	return (
		<div className="space-y-4">
			{recentRequests.map((request) => (
				<div key={request.id} className="flex items-center justify-between space-x-4 rounded-md border p-4">
					<div className="flex items-center space-x-4">
						<Avatar>
							<AvatarImage src={request.employee.avatar || "/placeholder.svg"} alt={request.employee.name} />
							<AvatarFallback>{request.employee.initials}</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium leading-none">{request.employee.name}</p>
							<p className="text-sm text-muted-foreground">{request.type}</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Badge variant="outline">{request.date}</Badge>
						<Badge>{request.status}</Badge>
						<div className="flex space-x-1">
							<Button variant="outline" size="icon" className="h-8 w-8">
								<Check className="h-4 w-4 text-green-500" />
								<span className="sr-only">Aprovar</span>
							</Button>
							<Button variant="outline" size="icon" className="h-8 w-8">
								<X className="h-4 w-4 text-red-500" />
								<span className="sr-only">Rejeitar</span>
							</Button>
						</div>
					</div>
				</div>
			))}
			<div className="flex justify-center">
				<Button variant="outline" size="sm">
					Ver todas as solicitações
				</Button>
			</div>
		</div>
	)
}
