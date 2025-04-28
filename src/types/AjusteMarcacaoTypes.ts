export interface AjusteMarcacaoDTO {
    id: number;
    matriculaColaborador: string;
    nomeColaborador: string;
    dataMarcacaoOriginal: string;
    marcacaoOriginal: string;
    marcacaoAjustada: string;
    justificativa: string;
    nomeGestor: string;
    dataAjuste: string;
}