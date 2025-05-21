import type React from "react"
import { useState, useEffect } from "react"
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

type Colaborador = {
    id: number
    nome: string
    email: string
    ativo: boolean
    criadoEm: string
}

interface EditCollaboratorDialogProps {
    employee: Colaborador | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: () => void
}

export function EditCollaboratorDialog({
    employee,
    open,
    onOpenChange,
    onSave,
}: EditCollaboratorDialogProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState("")
    const [emailError, setEmailError] = useState("")

    useEffect(() => {
        if (employee) {
            setName(employee.nome)
            setEmail(employee.email)
            setStatus(employee.ativo ? "active" : "inactive")
        }
    }, [employee])

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setEmailError("Formato de email inválido")
            return false
        }
        setEmailError("")
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !email || !status) {
            toast.error("Todos os campos são obrigatórios")
            return
        }

        if (!validateEmail(email)) return
        if (!employee) return

        try {
            const payload = {
                id: employee.id,
                nome: name,
                email,
                ativo: status === "active" ? true : false,
            }

            await api.put(`/colaborador/${employee.id}`, payload)

            onSave()
            onOpenChange(false)
            toast.success(`As informações de ${name} foram atualizadas com sucesso.`)
        } catch (error) {
            console.error("Erro ao atualizar colaborador:", error)
            toast.error("Erro ao atualizar colaborador.")
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value
        setEmail(newEmail)
        if (newEmail) {
            validateEmail(newEmail)
        } else {
            setEmailError("")
        }
    }

    if (!employee) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Editar Colaborador</DialogTitle>
                        <DialogDescription>Atualize as informações do colaborador no sistema.</DialogDescription>
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
                                onChange={handleEmailChange}
                                placeholder="email@empresa.com"
                                required
                                className={emailError ? "border-red-500" : ""}
                            />
                            {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus} required>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Ativo</SelectItem>
                                    <SelectItem value="inactive">Desativado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Salvar Alterações</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
