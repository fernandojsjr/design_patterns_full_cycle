import Installment from "./entity/Installment";

export default interface InstallmentGenerator {
    generate (leanCode: string, amount: number, period: number, rate: number): Promise<Installment[]>;
}