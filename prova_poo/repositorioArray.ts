import { Perfil, Postagem, PostagemAvancada, IRepositorioDePerfis, IRepositorioPostagens } from "./index";
import { AplicacaoError, AtributoVazioError, PerfilExistenteError, PerfilNaoEncontradoError, PostagemJaExisteError, PostagemNaoEncontradaError } from "./excecoes";

class RepositorioDePerfisArray implements IRepositorioDePerfis {
    private _perfis: Perfil[] = [];

    get perfis(): Perfil[] { 
        return this._perfis;
    }

    consultarPerfil(id?: number, nome?: string, email?: string): Perfil {
        let perfilProcurado!: Perfil;
        try {
            const perfilProcurado0 = this.perfis.find(p =>
                (id === undefined || p.idPerfil === id) &&
                (nome === undefined || p.nome === nome) &&
                (email === undefined || p.email === email)
            );

            if (!perfilProcurado0) {
                throw new PerfilNaoEncontradoError('Perfil não encontrado!');
            }

            perfilProcurado = perfilProcurado0;
        } catch (e: any) {
            if (e instanceof AplicacaoError) {
                console.log(e.message);
            }
        }

        return perfilProcurado;
    }

    incluirPerfil(perfil: Perfil){
        try {
            if (perfil.nome && perfil.email) {
                const perfilExiste = this.perfis.find(p => 
                    //(p.idPerfil === perfil.idPerfil) ||
                    (p.nome === perfil.nome) ||
                    (p.email === perfil.email)
                );

                if (perfilExiste) {
                    throw new PerfilExistenteError('O perfil já existe');
                }
            } else {
                throw new AtributoVazioError('Os atributos precisam ser preenchidos!');
            }

            perfil.idPerfil = this._perfis.length++;
            this.perfis.push(perfil); 
            console.log('Perfil incluído com sucesso!');
        } catch (e:any){
                if(e instanceof AplicacaoError){
                    console.log(e.message);
            } 
        }
    } 

    atualizarPerfil(perfil: Perfil): void {
        
    }
}

class RepositorioDePostagensArray implements IRepositorioPostagens{
    private _postagens: Postagem[] = [];

    get postagens(): Postagem[] { 
        return this._postagens;
    }

    consultarPostagem(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Postagem[]{
        let postagensFiltradas: Postagem[] = [];
    
        for (let p of this.postagens) { 
            if ((id == undefined || p.idPostagem == id) &&
                (texto == undefined || p.texto == texto) &&
                (perfil == undefined || p.perfil == perfil)) {
                if (hashtag !== undefined && p instanceof PostagemAvancada && (p as PostagemAvancada).existeHashtag(hashtag)) {
                    postagensFiltradas.push(p);
                } else if (hashtag == undefined) {
                    postagensFiltradas.push(p);
                }
            }
        }
    
        try{
            if(postagensFiltradas.length == 0){
                throw new PostagemNaoEncontradaError('Postagem não encontrada!');
            }
        } catch (e: any) {
            if (e instanceof AplicacaoError) {
                console.log(e.message);
            }
        }

        return postagensFiltradas;
    }

    consultarPostagemPorId(idPost: number): Postagem{
        let postagemProcurada!: Postagem;

        for(let p of this._postagens){
            if(p.idPostagem == idPost){
                postagemProcurada = p
            }
        }

        try{
            if(!postagemProcurada){
                throw new PostagemNaoEncontradaError('Postagem não encontrada!');
            }
        } catch (e: any) {
            if (e instanceof AplicacaoError) {
                console.log(e.message);
            }
        }

        return postagemProcurada;
    }

    consultarPorIndice(id:number){
        let indiceProcurado: number = -1;
        try{
            for(let i = 0; i < this.postagens.length; i++){ //!alterei postagens
                if(this.postagens[i].idPostagem == id){
                    indiceProcurado = i;
                }
            }

            if(indiceProcurado == -1){
                throw new PostagemNaoEncontradaError('Essa postagem não exite!')
            }
        } catch(e: any){
            if (e instanceof AplicacaoError){
                console.log(e.message);
            }
        }

        return indiceProcurado;
    }

    incluirPostagem(postagem: Postagem){
        try{
            if (postagem.texto.trim() && postagem.perfil) {
                postagem.idPostagem = this._postagens.length++
                this._postagens.push(postagem)
                postagem.perfil.postagensDoPerfil.push(postagem);
                console.log('Postagem incluída com sucesso!');
            } else {
                throw new AtributoVazioError('Todos os atributos da postagem devem estar preenchidos!');
            }
        } catch (e: any) {
            if (e instanceof AplicacaoError) {
                console.log(e.message);
            }
        }
    }     

    atualizarPostagem(postagem: Postagem): void {
        
    } 
}

export {RepositorioDePerfisArray, RepositorioDePostagensArray}