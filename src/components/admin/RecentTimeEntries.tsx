import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PointButton from "../PointButton"

type EntryType = "entrada" | "saida_almoco" | "retorno_almoco" | "saida"

interface TimeEntry {
	id: number
	employeeId: number
	employeeName: string
	employeeAvatar: string
	employeeInitials: string
	type: EntryType
	time: string
	timestamp: string
	duration: string
}

// Dados de exemplo
const recentTimeEntries: TimeEntry[] = [
	{
		id: 1,
		employeeId: 1,
		employeeName: "Ana Silva",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "AS",
		type: "entrada",
		time: "08:00",
		timestamp: "26/04/2025",
		duration: "04h:01min",
	},
	{
		id: 2,
		employeeId: 1,
		employeeName: "Ana Silva",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "AS",
		type: "saida_almoco",
		time: "12:01",
		timestamp: "26/04/2025",
		duration: "01h:02min",
	},
	{
		id: 3,
		employeeId: 1,
		employeeName: "Ana Silva",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "AS",
		type: "retorno_almoco",
		time: "13:03",
		timestamp: "26/04/2025",
		duration: "01h:02min",
	},
	{
		id: 4,
		employeeId: 1,
		employeeName: "Ana Silva",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "AS",
		type: "saida",
		time: "17:05",
		timestamp: "26/04/2025",
		duration: "01h:02min",
	},
	{
		id: 5,
		employeeId: 2,
		employeeName: "Carlos Oliveira",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "CO",
		type: "entrada",
		time: "08:15",
		timestamp: "26/04/2025",
		duration: "03h:45min",
	},
	{
		id: 6,
		employeeId: 2,
		employeeName: "Carlos Oliveira",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "CO",
		type: "saida_almoco",
		time: "12:00",
		timestamp: "26/04/2025",
		duration: "01h:00min",
	},
	{
		id: 7,
		employeeId: 3,
		employeeName: "Mariana Santos",
		employeeAvatar: "/placeholder-user.jpg",
		employeeInitials: "MS",
		type: "entrada",
		time: "09:00",
		timestamp: "26/04/2025",
		duration: "03h:00min",
	},
]

function getEntryTypeInfo(type: EntryType) {
	switch (type) {
		case "entrada":
			return { color: "main-green-color", icon: <i className="fa-solid fa-door-open text-3xl"></i> }
		case "saida_almoco":
			return { color: "main-blue-color", icon: <i className="fa-solid fa-mug-hot text-3xl"></i> }
		case "retorno_almoco":
			return { color: "main-yellow-color", icon: <i className="fa-solid fa-battery-full text-3xl"></i> }
		case "saida":
			return { color: "main-red-color", icon: <i className="fa-solid fa-door-closed text-3xl"></i> }
	}
}

function groupEntriesByEmployee(entries: TimeEntry[]) {
	const grouped: Record<number, TimeEntry[]> = {}

	entries.forEach((entry) => {
		if (!grouped[entry.employeeId]) {
			grouped[entry.employeeId] = []
		}
		grouped[entry.employeeId].push(entry)
	})

	return Object.values(grouped)
}

export function RecentTimeEntries() {
	const [timeFilter, setTimeFilter] = useState<"hoje" | "ontem" | "semana">("hoje")
	const groupedEntries = groupEntriesByEmployee(recentTimeEntries)

	const calculateTotalTime = (entries: TimeEntry[]) => {
		return "07h:24min"
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<Tabs defaultValue="hoje" onValueChange={(value) => setTimeFilter(value as any)}>
					<TabsList>
						<TabsTrigger value="hoje">Hoje</TabsTrigger>
						<TabsTrigger value="ontem">Ontem</TabsTrigger>
						<TabsTrigger value="semana">Esta Semana</TabsTrigger>
					</TabsList>
				</Tabs>
				<Button variant="outline" size="sm">
					Ver Todas
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{groupedEntries.map((employeeEntries, index) => {
					const employee = employeeEntries[0]
					const totalTime = calculateTotalTime(employeeEntries)

					return (
						<Card key={index} className="overflow-hidden">
							<CardContent className="p-0">
								<div className="p-4 flex justify-between items-center">
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarImage src={employee.employeeAvatar || "/placeholder.svg"} alt={employee.employeeName} />
											<AvatarFallback>{employee.employeeInitials}</AvatarFallback>
										</Avatar>
										<span className="font-medium">{employee.employeeName}</span>
									</div>
									<div className="text-sm font-medium">{totalTime}</div>
								</div>

								<div className="flex justify-between p-4 pt-0">
									{employeeEntries.map((entry) => {
										const { color, icon } = getEntryTypeInfo(entry.type)
										return (
											<div key={entry.id} className="flex flex-col items-center">
												<div className="w-17 h-17 mb-3" key={entry.id}>
													<PointButton icon={icon} color={color} />
												</div>
												<span className="text-xs text-center">{entry.duration}</span>
											</div>
										)
									})}
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
