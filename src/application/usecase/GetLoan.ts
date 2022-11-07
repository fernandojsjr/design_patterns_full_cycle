import RepositoryAbastractFactory from "../factory/RepositoryAbastractFactory";
import InstallmentRepository from "../repository/InstallmentRepository";
import LoanRepository from "../repository/LoanRepository";

export default class GetLoan {

    loanRepository: LoanRepository;
    installmentRepository: InstallmentRepository;

    constructor (readonly repositoryFactory: RepositoryAbastractFactory) {
        this.loanRepository = repositoryFactory.createLoanRepository();
        this.installmentRepository = repositoryFactory.createInstallmentRepository();
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