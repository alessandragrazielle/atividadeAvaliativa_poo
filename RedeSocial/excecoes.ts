class AplicacaoError extends Error{
    constructor(message:string){
        super(message);
    }
}

class PerfilExistenteError extends AplicacaoError{
    constructor(message:string){
        super(message);
    }
}

class AtributoVazioError extends AplicacaoError{
    constructor(message:string){
        super(message);
    }
}

class PerfilNaoEncontradoError extends AplicacaoError{
    constructor(message:string){
        super(message);
    }
}

class PostagemNaoEncontradaError extends Error{
    constructor(message:string){
        super(message);
    }
}

class PostagemJaExisteError extends AplicacaoError{
    constructor(message:string){
        super(message);
    }
}

export {AplicacaoError, PerfilExistenteError, AtributoVazioError, PerfilNaoEncontradoError, PostagemNaoEncontradaError, PostagemJaExisteError}
