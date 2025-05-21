import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import api from "@/services/api"

interface AddCollaboratorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: () => void
}

export function AddCollaboratorDialog({ open, onOpenChange, onAdd }: AddCollaboratorDialogProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [status, setStatus] = useState(true)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !email || !password) return

        try {
            const response = await api.post("/colaborador", {
                nome: name,
                email: email,
                senhaHash: password,
                ativo: status,
            })

            const novoColaborador = response.data

            onAdd?.()

            toast.success('Colaborador cadastrado')

            setName("")
            setEmail("")
            setPassword("")
            setStatus(true)
            onOpenChange(false)

        } catch (error) {
            console.error("Erro ao adicionar colaborador:", error)
            toast.error('Não foi possível cadastrar colaborador')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
                        <DialogDescription>Preencha os dados do novo colaborador para adicioná-lo ao sistema.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nome do colaborador"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@empresa.com"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha do colaborador"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={status.toString()}
                                onValueChange={(value) => setStatus(value === "true")}
                                required
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Ativo</SelectItem>
                                    <SelectItem value="false">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Adicionar Colaborador</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
