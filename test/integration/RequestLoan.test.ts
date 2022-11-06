import crypto from "crypto"
import GetLoan from "../../src/application/usecase/GetLoan";
import RequestLoan from "../../src/application/usecase/RequestLoan";
import PgPromiseConnection from "../../src/infra/database/PgPromiseConnection";
import InstallmentDatabaseRepository from "../../src/infra/database/repository/InstallmentDatabaseRepository";
import LoanDatabaseRepository from "../../src/infra/database/repository/LoanDatabaseRepositoy";

test("Deve aplicat para um financiamento utilizando a tabela price", async function(){

    const code = crypto.randomUUID();
    const connection = new PgPromiseConnection();
    const loanRepository = new LoanDatabaseRepository(connection);
    const installmentRepository = new InstallmentDatabaseRepository(connection);

    const requestLoan = new RequestLoan(loanRepository, installmentRepository);
    const inputRequestLoan = {
        code,
        purchasePrice: 250000,
        downPayment: 50000,
        salary: 70000,
        period: 12,
        type: "price"
    }

    await requestLoan.execute(inputRequestLoan);
    const getLoan = new GetLoan(loanRepository, installmentRepository);
    const inputGetLoan = {
        code
    }
    const output = await getLoan.execute(inputGetLoan);
    expect(output.installments).toHaveLength(12);
    const [firstInstallments] = output.installments;
    expect(firstInstallments.balance).toBe(184230.24);
    const lastInstallments = output.installments[output.installments.length - 1];
    expect(lastInstallments.balance).toBe(0);    
    
    await connection.close();
});