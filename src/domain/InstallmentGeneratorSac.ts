import currency from "currency.js";
import Installment from "./entity/Installment";
import InstallmentGenerator from "./InstallmentGenerator";

export default class GenerateInstallmentsSac implements InstallmentGenerator {
    async generate(loanCode: string, loanAmount: number, loanPeriod: number, loanRate: number): Promise<Installment[]> {
        const installments: Installment[] = [];
        let balance = currency(loanAmount);
        let rate = loanRate / 100;
        let installmentNumber = 1;

        let amortization = currency(balance.value / loanPeriod);
        while ( balance.value > 0) {
            let saldoInicial = currency(balance.value);
            let interest = currency(saldoInicial.value * rate);
            let updateBalance = currency(saldoInicial.value + interest.value);
            let amount = currency(interest.value + amortization.value);
            balance = currency(updateBalance.value - amount.value);
            if (balance.value <= 0.05) balance = currency(0);
            //console.log(installmentNumber, amount.value, interest.value, amortization.value, balance.value);
            installments.push( new Installment(
                loanCode,
                installmentNumber, 
                amount.value, 
                interest.value, 
                amortization.value,
                balance.value                    
            ));        
            installmentNumber++;
        }        

        return installments;
    }

}