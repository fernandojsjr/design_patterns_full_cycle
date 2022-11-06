import currency from "currency.js";
import Installment from "../../domain/entity/Installment";
import Loan from "../../domain/entity/Loan";
import InstallmentRepository from "../repository/InstallmentRepository";
import LoanRepository from "../repository/LoanRepository";

export default class RequestLoan {

    constructor (readonly loanDatabaseRepository: LoanRepository, 
        readonly installmentDatabaseRepository: InstallmentRepository) {
    }

    async execute (input: Input): Promise<void> {
        const loanAmount = input.purchasePrice - input.downPayment;
        const loanPeriod = input.period;
        const loanRate = 1;
        const loanType = input.type;

        await this.loanDatabaseRepository.save(new Loan(input.code, loanAmount, loanPeriod, loanRate, loanType));

        if(input.salary*0.25 < (loanAmount/loanPeriod)) {
            throw new Error("Insufficiente salary");
        }
        let balance = currency(loanAmount);
        let rate = loanRate / 100;
        let installmentNumber = 1
        if(loanType === 'price'){
            let formula = Math.pow(( 1 + rate), loanPeriod);
            let amount = balance.multiply((formula * rate) / (formula - 1 ));
            while (balance.value > 0){
                let interest = balance.multiply(rate);
                let amortization = amount.subtract(interest);
                balance = balance.subtract(amortization);
                if (balance.value <= 0.05) balance = currency(0);

                await this.installmentDatabaseRepository.save(new Installment(input.code, installmentNumber, amount.value, interest.value, amortization.value, balance.value));

                installmentNumber++;
            }
        }
        if (loanType === "sac") {
            let amortization = currency(balance.value / loanPeriod);
            while ( balance.value > 0) {
                let saldoInicial = currency(balance.value);
                let interest = currency(saldoInicial.value * rate);
                let updateBalance = currency(saldoInicial.value + interest.value);
                let amount = currency(interest.value + amortization.value);
                balance = currency(updateBalance.value - amount.value);
                if (balance.value <= 0.05) balance = currency(0);

                await this.installmentDatabaseRepository.save(new Installment(input.code, installmentNumber, amount.value, interest.value, amortization.value, balance.value));

                installmentNumber++;
            }
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