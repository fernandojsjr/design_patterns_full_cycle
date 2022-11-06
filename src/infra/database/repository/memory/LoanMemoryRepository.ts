import LoanRepository from "../../../../application/repository/LoanRepository";
import Loan from "../../../../domain/entity/Loan";

export default class LoanMemoryRepository implements LoanRepository {

    loans: Loan[];

    constructor() {
        this.loans = [];
    }

    async save(loan: Loan): Promise<void> {
        this.loans.push(loan);
    }
    
    async get(code: string): Promise<Loan> {
        const loan = this.loans.find(loan => loan.code === code);
        if(!loan) throw new Error();
        return loan;
    }

}