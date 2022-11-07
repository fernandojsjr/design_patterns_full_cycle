import InstallmentRepository from "../../../../application/repository/InstallmentRepository";
import Installment from "../../../../domain/entity/Installment";

export default class InstallmentMemoryRepository implements InstallmentRepository {
    
    installments: Installment[];

    constructor() {
        this.installments = [];
    }
    
    async save(installment: Installment): Promise<void> {
        this.installments.push(installment);
    }

    async getByCode(code: string): Promise<Installment[]> {
        return this.installments.filter(installment => installment.loanCode === code);
    }
    
}