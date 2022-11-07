import Installment from "../../domain/entity/Installment";
import LoanPrice from "../../domain/entity/LoanPrice";
import LoanSac from "../../domain/entity/LoanSac";

export default class SimulateLoan {

    constructor () {

    }

    async execute (input: Input): Promise<Output> {
        const output: Output = {
            code: input.code,
            installments: []
        };
        const amount = input.purchasePrice - input.downPayment;
        const loanPeriod = input.period;
        const loanRate = 1;
        const loanType = input.type;
        let installments: Installment[] = [];
        if(loanType === "price"){
            const loan = new LoanPrice(input.code, amount, loanPeriod, loanRate, loanType, input.salary);
            installments = loan.generateInstallments();

        }
        if(loanType === "sac"){
            const loan = new LoanSac(input.code, amount, loanPeriod, loanRate, loanType, input.salary);
            installments = loan.generateInstallments();
        }

        for(const installment of installments) {
            output.installments.push({
                installmentNumber: installment.number,
                amount: installment.amount,
                interest: installment.interest,
                amortization: installment.amortization,
                balance: installment.balance
            });
        }
        return output;
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