import InstallmentRepository from "../repository/InstallmentRepository";
import LoanRepository from "../repository/LoanRepository";

export default interface RespositoryAbastractFactory {
    createLoanRepository(): LoanRepository;
    createInstallmentRepository(): InstallmentRepository;
}