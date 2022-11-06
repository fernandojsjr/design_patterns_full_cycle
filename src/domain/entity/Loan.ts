export default class Loan {

    constructor(
        readonly code: string,
        readonly amount: number ,
        readonly period: number,
        readonly rate: number,
        readonly type: string ){

        }
}