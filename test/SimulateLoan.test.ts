import crypto from "crypto"

test("Deve simular um financiamento utilizando a tabela price", function(){
    // given
    const simulateLoan = new SimulateLoan();
    const input = {
        code: crypto.randomUUID,  
        purchasePrice: 250000,
        downPayment: 50000,
        salary: 70000,
        amount: 200000,
        period: 12
        
    }
    // when
    const output = await simulateLoan.execute(input);
    
    //then
    expect(output.installments).toHaveLength(12);
    const [firstInstallments] = output.installments;
    expect(firstInstallments.balance).toBe(184230.24);
    const [lastInstallments] = output.installments[output.installments.length - 1];
    expect(lastInstallments.balance).toBe(0);    

});