import Installment from "../../domain/entity/Installment"

export default interface InstallmentRepository {
 
    save(installment: Installment)
    getByCode(code: string): Promise<Installment[]>



}