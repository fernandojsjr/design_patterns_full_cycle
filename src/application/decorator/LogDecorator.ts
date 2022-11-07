import Usecase from "../usecase/UseCase";

export default class LogDecorator implements Usecase {

    constructor (readonly usecase: Usecase){

    }

    execute(input: any): Promise<any> {
        console.log(new Date(), input);
        return this.usecase.execute(input);
    }

}