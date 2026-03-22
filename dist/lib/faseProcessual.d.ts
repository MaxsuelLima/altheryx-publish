import { FaseProcessual } from "@prisma/client";
export declare function detectarFase(descricao: string): FaseProcessual | null;
export declare function calcularCorrecaoMonetaria(valor: number, indice: string, meses: number): {
    valorCorrigido: number;
    indiceAplicado: number;
    indiceMensal: number;
};
export declare const INDICES_DISPONIVEIS: string[];
//# sourceMappingURL=faseProcessual.d.ts.map