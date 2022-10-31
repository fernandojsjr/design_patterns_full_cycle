import pgp from 'pg-promise';


export default class GetLoan {
    
    contructor () {

    }

    async execute (input: Input): Promise<Output> {
        const connetction = pgp()("postgres://postgres:mysecretpassword@localhost:5432/app");
        const [loanData] = await connetction.query("select * from fc.loan where code = $1", [input.code]);
        const installmentsData = await connetction.query("select * from fc.installment where loan_code = $'", [input.code]);
        const output: Output = {
            code: loanData.code,
            installments: []
        };
        for(const installmentData of installmentsData){
            output.installments.push({
                installmentNumber: installmentData.number,
                amount: parseFloat(installmentData.amount),
                interest: parseFloat(installmentData.amortization),
                amortization: parseFloat(installmentData.amortization),
                balance: parseFloat(installmentData.balance)
            })
        }
        connetction.$pool.end();
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