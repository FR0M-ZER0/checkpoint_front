import { Bell, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from 'react-redux'
import { RootState } from "@/redux/store"

export function DashboardHeader() {
	const { count } = useSelector((state: RootState) => state.solicitations)
	return (
		<header className="sticky top-0 z-100 flex h-16 items-center gap-4 border-b bg-background px-6">
			<div className="flex items-center gap-2 font-semibold">
				<span>Checkpoint - Área administrativa</span>
			</div>
			<div className="ml-auto flex items-center gap-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="icon" className="relative">
							<Bell className="h-4 w-4" />
							<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
								{count}
							</span>
							<span className="sr-only">Notificações</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Notificações</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Nova solicitação de ajuste de ponto</DropdownMenuItem>
						<DropdownMenuItem>Nova solicitação de férias</DropdownMenuItem>
						<DropdownMenuItem>Nova justificativa de ausência</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* <ModeToggle /> */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="relative h-8 w-8 rounded-full">
							<Avatar className="h-8 w-8">
								<AvatarImage src="/placeholder-user.jpg" alt="Administrador" />
								<AvatarFallback>AD</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<User className="mr-2 h-4 w-4" />
							<span>Perfil</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Settings className="mr-2 h-4 w-4" />
							<span>Configurações</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<LogOut className="mr-2 h-4 w-4" />
							<span>Sair</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}