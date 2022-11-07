import crypto from "crypto"
import InstallmentRepository from "../../src/application/repository/InstallmentRepository";
import LoanRepository from "../../src/application/repository/LoanRepository";
import GetLoan from "../../src/application/usecase/GetLoan";
import RequestLoan from "../../src/application/usecase/RequestLoan";
import PgPromiseConnection from "../../src/infra/database/PgPromiseConnection";
import RepositoryMemoryFactory from "../../src/infra/factory/RepositoryMemoryFactory";

test("Deve aplicat para um financiamento utilizando a tabela price", async function(){

    const code = crypto.randomUUID();
    const connection = new PgPromiseConnection();
    //const repositoryFactory = new RepositoryDatabaseFactory(connection);
    const repositoryFactory = new RepositoryMemoryFactory();


    const requestLoan = new RequestLoan(repositoryFactory);
    const inputRequestLoan = {
        code,
        purchasePrice: 250000,
        downPayment: 50000,
        salary: 70000,
        period: 12,
        type: "price"
    }

    await requestLoan.execute(inputRequestLoan);
    const getLoan = new GetLoan(repositoryFactory);
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