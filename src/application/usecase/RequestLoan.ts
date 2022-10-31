import currency from "currency.js";
import pgp from 'pg-promise';

export default class RequestLoan {
    constructor () {}

    async execute (input: Input): Promise<void> {
        const connetction = pgp()("postgres://postgres:mysecretpassword@localhost:5432/app");

        const loanAmount = input.purchasePrice - input.downPayment;
        const loanPeriod = input.period;
        const loanRate = 1;
        const loanType = input.type;

        await connetction.
            query("insert into fc.loan (code, amount, period, rate, type) values ($1, $2, $3, $4, $5)",
            [input.code, loanAmount, loanPeriod, loanRate, loanType]);


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

                await connetction
                    .query("insert into fc.installment (loan_code, number, amount, interest, amortization, balance) values ($1, $2, $3, $4, $5, $6)"
                    , [input.code, installmentNumber, amount.value, interest.value, amortization.value, balance.value]);

                // await connetction
                //     .query("insert into fc.installment (loan_code, number) values ($1, $2)"
                //     , [input.code, installmentNumber]);

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

                await connetction.query("insert into fc.installment (loan_code, number, amount, interest, amortization, balance) values ($1, $2, $3, $4, $5, $6)"
                    , [input.code, installmentNumber, amount.value, interest.value, amortization.value, balance.value]);
             
                installmentNumber++;
            }
        }
       //connetction.$pool.end();
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