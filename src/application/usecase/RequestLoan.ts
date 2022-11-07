import Installment from "../../domain/entity/Installment";
import Loan from "../../domain/entity/Loan";
import InstallmentGenerateFactory from "../../domain/factory/InstallmentGenerateFactory";
import RepositoryAbastractFactory from "../factory/RepositoryAbastractFactory";
import InstallmentRepository from "../repository/InstallmentRepository";
import LoanRepository from "../repository/LoanRepository";
import Usecase from "./UseCase";

export default class RequestLoan implements Usecase {
    loanRepository: LoanRepository;
    installmentRepository: InstallmentRepository;

    constructor (readonly repositoryFactory: RepositoryAbastractFactory) {
        this.loanRepository = repositoryFactory.createLoanRepository();
        this.installmentRepository = repositoryFactory.createInstallmentRepository();
    }

    async execute (input: Input): Promise<void> {
        const amount = input.purchasePrice - input.downPayment;
        const loanPeriod = input.period;
        const loanRate = 1;
        const loanType = input.type;

        await this.loanRepository.save(new Loan(input.code, amount, loanPeriod, loanRate, loanType, input.salary));

        if(input.salary*0.25 < (amount/loanPeriod)) {
            throw new Error("Insufficiente salary");
        }
        const generateInstallments = InstallmentGenerateFactory.create(loanType);
        const installments = await generateInstallments.generate(input.code, amount, input.period, loanRate);
        for(const installment of installments) {
                await this.installmentRepository.save(new Installment(input.code, installment.number, 
                    installment.amount, installment.interest, 
                    installment.amortization, installment.balance));
        }
    }
}

type Input = {
    code: string,
    purchasePrice: number,
    downPayment: number,
    salary: number,
    period: number,
    type: string

}