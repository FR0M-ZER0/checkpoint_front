import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

const activityData = [
	{ day: "Seg", entradas: 45, saidas: 42 },
	{ day: "Ter", entradas: 47, saidas: 46 },
	{ day: "Qua", entradas: 46, saidas: 45 },
	{ day: "Qui", entradas: 48, saidas: 47 },
	{ day: "Sex", entradas: 49, saidas: 48 },
	{ day: "Sáb", entradas: 20, saidas: 20 },
	{ day: "Dom", entradas: 5, saidas: 5 },
]

export function EmployeeActivity() {
	return (
		<ChartContainer
			config={{
				activities: {
					label: "Atividades",
				},
				entradas: {
					label: "Entradas",
					color: "hsl(var(--chart-1))",
				},
				saidas: {
					label: "Saídas",
					color: "hsl(var(--chart-2))",
				},
			}}
			className="h-[240px] w-full"
		>
			<BarChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
				<XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
				<YAxis hide />
				<Bar dataKey="entradas" fill="var(--color-entradas)" radius={[4, 4, 0, 0]} />
				<Bar dataKey="saidas" fill="var(--color-saidas)" radius={[4, 4, 0, 0]} />
				<ChartTooltip content={<ChartTooltipContent labelKey="activities" indicator="line" />} cursor={false} />
			</BarChart>
		</ChartContainer>
	)
}
