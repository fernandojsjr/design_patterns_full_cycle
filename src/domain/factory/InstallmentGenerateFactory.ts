import InstallmentGeneratorPrice from "../InstallmentGeneratorPrice";
import InstallmentGeneratorSac from "../InstallmentGeneratorSac";

export default class InstallmentGenerateFactory {

    static create(type: string){
        if(type === 'price'){
            return new InstallmentGeneratorPrice();
        }

        if (type === "sac") {
            return new InstallmentGeneratorSac();
        }
        throw new Error();    
    }
}