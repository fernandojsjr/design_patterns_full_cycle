import RespositoryAbastractFactory from "../../application/factory/RepositoryAbastractFactory";
import InstallmentRepository from "../../application/repository/InstallmentRepository";
import LoanRepository from "../../application/repository/LoanRepository";
import Connection from "../database/Connection";
import InstallmentDatabaseRepository from "../repository/InstallmentDatabaseRepository";
import LoanDatabaseRepository from "../repository/LoanDatabaseRepositoy";

export default class RepositoryDatabaseFactory implements RespositoryAbastractFactory {

    constructor (readonly connection: Connection){

    }
    createLoanRepository(): LoanRepository {
        return new LoanDatabaseRepository(this.connection);
    }
    createInstallmentRepository(): InstallmentRepository {
        return new InstallmentDatabaseRepository(this.connection);
    }


}