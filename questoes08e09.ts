/*8. Crie uma interface chamada IComparavel com um método chamado comparar que
receba uma forma geométrica como parâmetro e retorna um inteiro como
resultado. Implemente em cada uma das classes do exemplo anterior a interface
retornando -1, 0 e 1 caso a área da forma seja menor, igual ou maior que a
passada via parâmetro. 
9. Crie uma classe para testar os exemplos anteriores. Instancie várias formas
diferentes. Pegue duas formas chame em uma delas o método comparar
passando a outra como parâmetro e exiba o resultado. Repita para outras formas.
*/

interface IComparavel{
    comparar(formaGeometrica: FiguraGeometrica):number;
}

interface FiguraGeometrica{
    area():number;
    perimetro():number;
}

class Quadrado implements FiguraGeometrica, IComparavel{
    private _lado:number;
    
    constructor(lado:number) {
        this._lado = lado;
    }
    get lado():number{
        return this._lado;
    }

    area(): number {
        return this.lado * this.lado;
    }
    perimetro(): number {
        return this.lado * 4;
    }

    comparar(formaGeometrica: FiguraGeometrica): number {
        if (this.area() < formaGeometrica.area()) {
            return -1;
        } else if (this.area() == formaGeometrica.area()) {
            return 0;
        }
        return 1;
    }
}

class Triangulo implements FiguraGeometrica{
    private _base:number;
    private _altura:number;

    constructor(b:number, a:number){
        this._base = b;
        this._altura = a;
    }

    get base():number{
        return this._base;
    }
    get altura():number{
        return this._altura;
    }

    area(): number {
        return (this.base * this.altura) / 2;
    }
    perimetro(): number {
        return this.base * 3;
    }

    comparar(formaGeometrica: FiguraGeometrica): number {
        if (this.area() < formaGeometrica.area()) {
            return -1;
        } else if (this.area() == formaGeometrica.area()) {
            return 0;
        }
        return 1;
    }
}

class Circulo implements FiguraGeometrica{
    private _raio:number;
    private _pi: number = 3.14;

    constructor(r:number) {
        this._raio = r;
    }

    get raio():number{
        return this._raio;
    }
    get pi():number{
        return this._pi; 
    }

    area(): number {
        return this.pi * (this.raio ^ 2);
    }
    perimetro(): number {
        return this.pi * this.raio * 2;
    }

    comparar(formaGeometrica: FiguraGeometrica): number {
        if (this.area() < formaGeometrica.area()) {
            return -1;
        } else if (this.area() == formaGeometrica.area()) {
            return 0;
        }
        return 1;
    }
}

class TestarFormas{
    executar(){
        let q1: Quadrado = new Quadrado(8);
        let q2: Quadrado = new Quadrado(7);
        let t1: Triangulo = new Triangulo(4, 5);
        let t2: Triangulo = new Triangulo(3,9);
        let c1: Circulo = new Circulo(12);
        let c2: Circulo = new Circulo(34);

        let resultado = q1.comparar(q2);

        if (resultado === -1) {
            console.log("A primeira forma é menor que a segunda.");
        } else if (resultado === 0) {
            console.log("As formas são iguais em tamanho.");
        } else {
            console.log("A primeira forma é maior que a segunda.");
        }
    }
}
let tf: TestarFormas = new TestarFormas();
tf.executar();

let q1: Quadrado = new Quadrado(4);
let q2: Quadrado = new Quadrado(4);

let t1: Triangulo = new Triangulo(2, 6);
let t2: Triangulo = new Triangulo(5, 7);

let c1: Circulo = new Circulo(4);
let c2: Circulo = new Circulo(9);

console.log('QUADRADO');
console.log('Área: ', q1.area());
console.log('Perímetro: ', q1.perimetro());
console.log('O valor é: ', q1.comparar(t1));

console.log('\nTRIANGULO');
console.log('Área: ', t1.area());
console.log('Perímetro: ', t1.perimetro());
console.log('O valor é: ', t1.comparar(q2));


console.log('\nCIRCULO');
console.log('Área: ', c1.area());
console.log('Perímetro: ', c1.perimetro());
console.log('O valor é: ', t1.comparar(c1));
