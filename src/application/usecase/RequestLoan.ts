import Installment from "../../domain/entity/Installment";
import Loan from "../../domain/entity/Loan";
import InstallmentGenerateFactory from "../../domain/factory/InstallmentGenerateFactory";
import InstallmentRepository from "../repository/InstallmentRepository";
import LoanRepository from "../repository/LoanRepository";

export default class RequestLoan {

    constructor (readonly loanDatabaseRepository: LoanRepository, 
        readonly installmentDatabaseRepository: InstallmentRepository) {
    }

    async execute (input: Input): Promise<void> {
        const amount = input.purchasePrice - input.downPayment;
        const loanPeriod = input.period;
        const loanRate = 1;
        const loanType = input.type;

        await this.loanDatabaseRepository.save(new Loan(input.code, amount, loanPeriod, loanRate, loanType));

        if(input.salary*0.25 < (amount/loanPeriod)) {
            throw new Error("Insufficiente salary");
        }
        const generateInstallments = InstallmentGenerateFactory.create(loanType);
        const installments = await generateInstallments.generate(input.code, amount, input.period, loanRate);
        for(const installment of installments) {
                await this.installmentDatabaseRepository.save(new Installment(input.code, installment.number, 
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