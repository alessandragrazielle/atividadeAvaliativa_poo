### Classes Abstratas

1. Podemos instanciar classes abstratas? Justifique.
- Não, porque uma classe abstrata ela serve como modelo para outras classes e serem estendidas por elas, nela pode estar presente a definição de atributos e métodos, que podem ser abstratos e/ou concretos. 

2. Explique o que é necessário para que a compilação da ClasseConcreta ocorra sem erros:
- É necessário que a classe filha além de herdar o método abstrato, também implemente-o.
```typescript
abstract class ClasseAbstrata {
    abstract imprimaAlgo(): void ;
}
class ClasseConcreta extends ClasseAbstrata {
    abstract imprimaAlgo():void{
        //implementação
        console.log('Classe Abstrata.')
    }
}
```

3. Se uma classe que herda de uma abstrata e não implementa os seus métodos, o que ocorre?
- Se ela não implementa os métodos, gera erro de compilação. Dessa forma, ou a classe implementa os métodos ou se declara como uma classe abstrata já que se não há implementação dos métodos, somente assinatura ela apresenta as características de classe abstrata.

5. Não podemos aplicar o operador new em FiguraGeometrica, mas porque então podemos realizar o seguinte código de instanciação:
```typescript 
abstract class FiguraGeometrica {
    //...
}
let figuras: FiguraGeometrica[] = new Array();
```
- Porque o que está sendo feito não é a instância da classe FiguraGeometrica, e sim criando um novo array para armazenar 
instâncias das classes que estenderem a classe FiguraGeometrica. 
