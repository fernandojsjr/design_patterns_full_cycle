export default interface Usecase {
    execute (inout: any): Promise<any>;
}