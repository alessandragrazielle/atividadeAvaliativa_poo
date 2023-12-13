interface Tributavel{
    calculaTributos():number;
}

class Conta{
    private _nome: string;
    private _saldo: number;
    constructor(nome:string,saldo:number) {
        this._nome = nome;
        this._saldo = saldo;
    }
    
    get nome():string{
        return this._nome;
    }
    get saldo():number{
        return this._saldo;
    }
    set saldo(newSaldo:number){
        this.saldo = newSaldo;
    }
}

class ContaCorrente extends Conta implements Tributavel{
    constructor(nome:string, saldo:number) {
        super(nome,saldo);
    }

    calculaTributos(): number {
        return this.saldo + (this.saldo * (10/100));
    }
}

class SeguroDeVida implements Tributavel{
    calculaTributos(): number {
        return 50.00;
    }
}

class AuditoriaInterna{
    private _tributaveis: Tributavel [] = [];

    adicionar(tributavel: Tributavel):void{
        this._tributaveis.push(tributavel);
    }

    calcularTributos():number{
        let valorTotalTributos:number = 0;

        for (let tributavel of this._tributaveis) {
            valorTotalTributos += tributavel.calculaTributos();
        }
        return valorTotalTributos;
    }
}

class Testes{
    executar(){
        let auditoria: AuditoriaInterna = new AuditoriaInterna();

        let cc1: ContaCorrente = new ContaCorrente('Maria',50);
        let cc2: ContaCorrente = new ContaCorrente('Maria',50);

        let sv1 = new SeguroDeVida();
        let sv2 = new SeguroDeVida();
        
        auditoria.adicionar(cc1);
        auditoria.adicionar(cc2);

        auditoria.adicionar(sv1);
        auditoria.adicionar(sv2);

        let totalTributos = auditoria.calcularTributos();
        console.log(`Total de tributos a serem pagos: R$ ${totalTributos.toFixed(2)}`);
    }
}

let cc1: ContaCorrente = new ContaCorrente('Maria',90);
console.log(`Conta\nNome: ${cc1.nome}, Saldo: ${cc1.saldo.toFixed(2)}\nValor do Tributo: ${cc1.calculaTributos().toFixed(2)}`);

let sv: SeguroDeVida = new SeguroDeVida();
console.log('Valor Seguro de Vida:R$',sv.calculaTributos().toFixed(2));

let testes: Testes = new Testes();
testes.executar(); 
