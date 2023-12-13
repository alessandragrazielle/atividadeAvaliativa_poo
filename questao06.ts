/* 6. Implemente as classes Funcionario, Gerente e Diretor conforme o diagrama exposto em sala:
a. A classe funcionário deve ser abstrata e o método getBonificacao() abstrato;
b. Na classe gerente o método bonificação deve retornar 40% do salário;
c. Em Diretor a bonificação deve ser 60% do salário.
d. Por fim, na classe presidente o método deve retornar 100% do salário + R$ 1.000,00. */

abstract class Funcionario{
    protected salario:number;
    constructor(salario:number) {
        this.salario = salario;
    }

    abstract getBonificacao():number;
}

class Gerente extends Funcionario{
    protected salario: number;
    constructor(salario:number) {
        super(salario);
        this.salario = salario;
    }

    getBonificacao(): number {
        return this.salario * (40/100);
    }
}

class Diretor extends Funcionario{
    protected salario: number;
    constructor(salario:number) {
        super(salario);
        this.salario = salario;
    }

    getBonificacao(): number {
        return this.salario * (60/100);
    }
}

class Presidente extends Funcionario{
    protected salario: number;
    constructor(salario:number) {
        super(salario);
        this.salario = salario;
    }

    getBonificacao(): number {
        return this.salario + 1000.00;
    }
}

let g: Gerente = new Gerente(1200);
console.log(`Gerente: ${g.getBonificacao()}`);

let d: Diretor =new Diretor(1300);
console.log(`Diretor: ${d.getBonificacao()}`);

let p: Presidente = new Presidente(20000);
console.log(`Presidente: ${p.getBonificacao()}`);

