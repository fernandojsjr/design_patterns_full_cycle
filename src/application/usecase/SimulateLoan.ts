import currency from "currency.js";
import { OutputFileType } from "typescript";

export default class SimulateLoan {

    constructor () {

    }

    async execute (input: Input): Promise<Output> {

        const output: Output = {
            code: input.code,
            installments: []
        };
        const loanAmount = input.purchasePrice - input.downPayment;
        const loanPeriod = input.period;
        const loanRate = 1;
        const loanType = input.type;
        console.log("laonType: " + loanType);
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
                output.installments.push({
                    installmentNumber, 
                    amount: amount.value, 
                    interest: interest.value, 
                    amortization: amortization.value,
                    balance: balance.value                    
                })
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
                //console.log(installmentNumber, amount.value, interest.value, amortization.value, balance.value);
                output.installments.push({
                    installmentNumber, 
                    amount: amount.value, 
                    interest: interest.value, 
                    amortization: amortization.value,
                    balance: balance.value                    
                })                
                installmentNumber++;
            }
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