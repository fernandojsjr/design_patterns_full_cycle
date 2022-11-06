import InstallmentRepository from "../repository/InstallmentRepository";
import LoanRepository from "../repository/LoanRepository";

export default class GetLoan {

    constructor(readonly loanRepository: LoanRepository, readonly installmentRepository: InstallmentRepository) {

    }

    async execute (input: Input): Promise<Output> {
        const loan = await this.loanRepository.get(input.code);
        const installments = await this.installmentRepository.getByCode(loan.code);

        const output: Output = {
            code: loan.code,
            installments: []
        }

        for(const installment of installments){
            output.installments.push({
                installmentNumber: installment.number,
                amount: installment.amount,
                interest: installment.amortization,
                amortization: installment.amortization,
                balance: installment.balance
            })
        }
        return output;
    }
}

type Input = {
    code: string
}

type Output = {
    code: string,
    installments: {
        installmentNumber: number,
        amount: number,
        interest: number,
        amortization: number,
        balance: number
    }[]
}