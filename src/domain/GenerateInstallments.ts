import Installment from "./entity/Installment";

export default interface GenerateInstallments {
    generate (leanCode: string, amount: number, period: number, rate: number): Promise<Installment[]>;
}