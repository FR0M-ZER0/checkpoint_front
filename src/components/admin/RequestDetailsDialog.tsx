import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { formatDate } from "@/utils/formatter"

interface Request {
	id: number
	employee: string
	department: string
	date: string
	requestDate: string
	status: "Pendente" | "Aprovado" | "Rejeitado"
	details: string
}

interface RequestDetailsDialogProps {
	request: Request | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onApprove: (id: number) => void
	onReject: (id: number) => void
	type: string
  }

export function RequestDetailsDialog({ request, open, onOpenChange, onApprove, onReject, type }: RequestDetailsDialogProps) {
	if (!request) return null

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Detalhes da Solicitação</DialogTitle>
					<DialogDescription>Visualize os detalhes completos da solicitação e tome uma ação.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					{type === 'ajustes' ? (
						<>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Colaborador:</div>
								<div>{request.colaboradorNome}</div>
							</div>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Departamento:</div>
								<div>{request.department}</div>
							</div>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Período:</div>
								<div>{request.periodo}</div>
							</div>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Data da Solicitação:</div>
								<div>{formatDate(request.criadoEm)}</div>
							</div>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Tipo:</div>
								<div>{request.tipo}</div>
							</div>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Horário:</div>
								<div>{request.horario}</div>
							</div>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Observação:</div>
								<div className="max-h-[150px] overflow-y-auto rounded-md border p-3 text-sm">{request.observacao}</div>
							</div>
						</>
					) : (
						<>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Colaborador:</div>
								<div>{request.employee}</div>
							</div>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Departamento:</div>
								<div>{request.department}</div>
							</div>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Data:</div>
								<div>{request.date}</div>
							</div>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Solicitado em:</div>
								<div>{request.requestDate}</div>
							</div>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Status:</div>
								<div>
								<Badge
									variant={request.status === "Rejeitado" ? "destructive" : "outline"}
									className={request.status === "Aprovado" ? "bg-green-600 text-white" : ""}
								>
									{request.status}
								</Badge>
								</div>
							</div>
							<div className="grid grid-cols-[120px_1fr] items-start gap-2">
								<div className="font-medium">Detalhes:</div>
								<div className="max-h-[150px] overflow-y-auto rounded-md border p-3 text-sm">{request.details}</div>
							</div>
						</>
					)}
				</div>
				<DialogFooter className="flex justify-between sm:justify-between">
					{request.status.toLowerCase() === "pendente" ? (
						<>
							<Button
								variant="outline"
								className="border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-600 dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900"
								onClick={() => {
									onReject(request.id)
									onOpenChange(false)
								}}
							>
								<X className="mr-2 h-4 w-4 text-red-500" />
								Rejeitar
							</Button>
							<Button
								className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900"
								onClick={() => {
									onApprove(request.id)
									onOpenChange(false)
								}}
							>
								<Check className="mr-2 h-4 w-4" />
								Aprovar
							</Button>
						</>
					) : (
						<Button onClick={() => onOpenChange(false)} className="ml-auto">
							Fechar
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}