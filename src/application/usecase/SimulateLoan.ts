import currency from "currency.js";
import Installment from "../../domain/entity/Installment";
import GenerateInstallmentsPrice from "../../domain/GenerateInstallmentsPrice";
import GenerateInstallmentsSac from "../../domain/GenerateInstallmentsSac";

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

        if(input.salary*0.25 < (amount/loanPeriod)) {
            throw new Error("Insufficiente salary");
        }
        
        let installments: Installment[] = [];
        if(loanType === 'price'){
            const generateInstallments = new GenerateInstallmentsPrice();
            installments = await generateInstallments.generate(input.code, amount, input.period, loanRate);

        }
        if (loanType === "sac") {
            const generateInstallments = new GenerateInstallmentsSac();
            installments = await generateInstallments.generate(input.code, amount, input.period, loanRate);
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