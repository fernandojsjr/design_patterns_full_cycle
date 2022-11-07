import Installment from "./Installment";

export default abstract class AbastractLoan {
    
    constructor(
        readonly code: string,
        readonly amount: number ,
        readonly period: number,
        readonly rate: number,
        readonly type: string
    ){}

    abstract generateInstallments (): Installment[];




}