import { useState } from "react";
import { Link, useLocation } from "react-router";
import { BarChart, ClipboardCheck, ClipboardList, FileText, Home, Menu, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
	title: string;
	href: string;
	icon: React.ElementType;
}

const navItems: NavItem[] = [
	{
		title: "Dashboard",
		href: "/admin/dashboard",
		icon: Home,
	},
	{
		title: "Solicitações",
		href: "/admin/solicitacoes",
		icon: ClipboardList,
	},
	{
		title: "Colaboradores",
		href: "/admin/colaboradores",
		icon: Users,
	},
	{
		title: "Marcações de Ponto",
		href: "/admin/marcacoes",
		icon: ClipboardCheck,
	},
	{
		title: "Relatórios",
		href: "/admin/relatorios",
		icon: FileText,
	},
	{
		title: "Análises",
		href: "/admin/analises",
		icon: BarChart,
	},
	{
		title: "Configurações",
		href: "/admin/configuracoes",
		icon: Settings,
	},
];

export function DashboardSidebar() {
	const location = useLocation();
	const pathname = location.pathname;
	const [isOpen, setIsOpen] = useState(true);

	return (
		<>
			<div
				className={cn(
					"fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform duration-300 md:static",
					isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
				)}
			>
				<div className="flex h-16 items-center border-b px-4">
					<Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(!isOpen)}>
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle Sidebar</span>
					</Button>
				</div>
				<nav className="flex-1 overflow-auto p-2">
					<ul className="grid gap-1">
						{navItems.map((item) => (
							<li key={item.href}>
								<Link
									to={item.href}
									className={cn(
										"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
										pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
									)}
								>
									<item.icon className="h-5 w-5" />
									<span className={cn("transition-opacity", isOpen ? "opacity-100" : "opacity-0 md:hidden")}>
										{item.title}
									</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
			{!isOpen && (
				<Button
					variant="ghost"
					size="icon"
					className="fixed bottom-4 left-4 z-10 md:hidden"
					onClick={() => setIsOpen(true)}
				>
					<Menu className="h-5 w-5" />
					<span className="sr-only">Open Sidebar</span>
				</Button>
			)}
		</>
	);
}
