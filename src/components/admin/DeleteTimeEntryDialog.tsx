import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type TimeEntry, getEntryTypeInfo } from "./TimeEntriesTable"

interface DeleteTimeEntryDialogProps {
	entry: TimeEntry
	open: boolean
	onOpenChange: (open: boolean) => void
	onDelete: () => void
}

export function DeleteTimeEntryDialog({ entry, open, onOpenChange, onDelete }: DeleteTimeEntryDialogProps) {
	const { name } = getEntryTypeInfo(entry.type)

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Excluir Marcação de Ponto</AlertDialogTitle>
					<AlertDialogDescription>
						Tem certeza que deseja excluir esta marcação de ponto?
						<div className="mt-4 p-4 border rounded-md bg-muted/50">
							<div className="grid grid-cols-2 gap-2 text-sm">
								<div className="font-medium">Colaborador:</div>
								<div>{entry.employeeName}</div>

								<div className="font-medium">Tipo:</div>
								<div>{name}</div>

								<div className="font-medium">Data:</div>
								<div>{entry.date}</div>

								<div className="font-medium">Hora:</div>
								<div>{entry.time}</div>
							</div>
						</div>
						<p className="mt-4 text-destructive font-medium">Esta ação não pode ser desfeita.</p>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={onDelete}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						Excluir
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
