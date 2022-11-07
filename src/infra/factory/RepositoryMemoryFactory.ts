import RespositoryAbastractFactory from "../../application/factory/RepositoryAbastractFactory";
import InstallmentRepository from "../../application/repository/InstallmentRepository";
import LoanRepository from "../../application/repository/LoanRepository";
import InstallmentMemoryRepository from "../repository/memory/InstallmentMemoryRepository";
import LoanMemoryRepository from "../repository/memory/LoanMemoryRepository";

export default class RepositoryMemoryFactory implements RespositoryAbastractFactory {

    createLoanRepository(): LoanRepository {
        return LoanMemoryRepository.getInstance();
    }

    createInstallmentRepository(): InstallmentRepository {
        return InstallmentMemoryRepository.getInstance();
    }

}