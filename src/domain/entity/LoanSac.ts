import { timingSafeEqual } from "crypto";
import currency from "currency.js";
import AbastractLoan from "./AbstractLoan";
import Installment from "./Installment";

export default class LoanSac extends AbastractLoan {
    
    generateInstallments(): Installment[] {

        const installments: Installment[] = [];
        let balance = currency(this.amount);
        let rate = this.rate / 100;
        let installmentNumber = 1;

        let amortization = currency(balance.value / this.period);
        while ( balance.value > 0) {
            let saldoInicial = currency(balance.value);
            let interest = currency(saldoInicial.value * rate);
            let updateBalance = currency(saldoInicial.value + interest.value);
            let amount = currency(interest.value + amortization.value);
            balance = currency(updateBalance.value - amount.value);
            if (balance.value <= 0.05) balance = currency(0);
            //console.log(installmentNumber, amount.value, interest.value, amortization.value, balance.value);
            installments.push( new Installment(
                this.code,
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