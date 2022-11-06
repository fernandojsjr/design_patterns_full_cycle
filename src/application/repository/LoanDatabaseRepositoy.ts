import Loan from "../../domain/entity/Loan"

export default interface LoanRepository {

    save(loan: Loan): Promise<any>
    get (code: string): Promise<Loan>
}