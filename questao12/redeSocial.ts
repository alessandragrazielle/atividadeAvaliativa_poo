import { Perfil, Postagem, PostagemAvancada, IRepositorioDePerfis, IRepositorioPostagens } from "./index";
import { AplicacaoError, PerfilExistenteError, PerfilNaoEncontradoError, PostagemNaoEncontradaError } from "./excecoes";

class RedeSocial {
    private _repositorioDePerfis: IRepositorioDePerfis;
    private _repositorioDePostagens: IRepositorioPostagens;

    constructor(repositorioDePerfis: IRepositorioDePerfis, repositorioDePostagens: IRepositorioPostagens) {
        this._repositorioDePerfis = repositorioDePerfis;
        this._repositorioDePostagens = repositorioDePostagens;
       
    }

    incluirPerfil(perfil: Perfil) {
        this._repositorioDePerfis.incluirPerfil(perfil);
    }

    consultarPerfil(id?: number, nome?: string, email?: string): Perfil {
        return this._repositorioDePerfis.consultarPerfil(id, nome, email);
    }

    incluirPostagem(postagem: Postagem){
        this._repositorioDePostagens.incluirPostagem(postagem);
    }

    consultarPostagem(id?: number | undefined, texto?: string | undefined, hashtag?: string | undefined, perfil?:  Perfil | undefined): Postagem[]{
        return this._repositorioDePostagens.consultarPostagem(id, texto, hashtag, perfil);
    }

    curtir(idPost: number): void {
        let postagemProcurada = this._repositorioDePostagens.consultarPostagemPorId(idPost);  
        if (postagemProcurada !== undefined) {   
            postagemProcurada.curtir();
            this._repositorioDePostagens.atualizarPostagem(postagemProcurada);
        }
    }
   
    descurtir(idPost: number): void {
        let postagemProcurada = this._repositorioDePostagens.consultarPostagemPorId(idPost);
        if (postagemProcurada.idPostagem == idPost) {
            postagemProcurada.descurtir();
            this._repositorioDePostagens.atualizarPostagem(postagemProcurada);
        }
    }
   
    decrementar(postagem: PostagemAvancada): void {
        postagem.decrementarVisualizacoes();
        this._repositorioDePostagens.atualizarPostagem(postagem);
    }

    exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] {
        let postagensFiltradas: PostagemAvancada [] = [];
        
        let result = this.consultarPostagem(undefined, undefined, hashtag, undefined);

        if (typeof result === 'string') {
            console.log(result);
            return postagensFiltradas;
        }

        for(let postagem of result){
            if (postagem instanceof PostagemAvancada && postagem.existeHashtag(hashtag)){
                if (postagem.visualizacoesRestantes > 0){
                    postagensFiltradas.push(postagem);
                    postagem.decrementarVisualizacoes();
                }
            }
        }
        return postagensFiltradas;
    }

    exibirPostagensPorPerfil(id: number): Postagem[] {
        let postagensFiltradas: Postagem[] = [];
        let perfilProcurado = this.consultarPerfil(id);
    
        if (perfilProcurado) { // Verificar se o perfil foi encontrado
            for (let postagem of perfilProcurado.postagensDoPerfil) {
                if (postagem instanceof PostagemAvancada) {
                    if (postagem.visualizacoesRestantes > 0) {
                        postagensFiltradas.push(postagem);
                        postagem.decrementarVisualizacoes();
                    }
                } else {
                    postagensFiltradas.push(postagem);
                }
            }
        }
    
        return postagensFiltradas;
    }
    
    exibirPerfis(): string{
        let perfis = '';
        for(let p of this._repositorioDePerfis.perfis){
            perfis += `
            Id: ${p.idPerfil}
            Nome: ${p.nome}
            Email: ${p.email}
            `
        }

        return perfis;
    } 

    exibirTodasAsPostagens(){
        return this._repositorioDePostagens.postagens;
    } 
    
    exibirPerfil(idPerfil: number){ 
        let perfilProcurado = this.consultarPerfil(idPerfil);

        if((perfilProcurado) && perfilProcurado.idPerfil == idPerfil){
            return `Id: ${perfilProcurado.idPerfil},\nUsuário: ${perfilProcurado.nome},\nEmail: ${perfilProcurado.email}.`;
        }
    } 

    exibirPorPostagem(idPostagem?: number, texto?: string) { 
        let postagemProcurada = this.consultarPostagem(idPostagem);
   
        if(postagemProcurada instanceof PostagemAvancada){
            if (postagemProcurada.visualizacoesRestantes > 0){
                postagemProcurada.decrementarVisualizacoes();
                this._repositorioDePostagens.atualizarPostagem(postagemProcurada);
            }
        }
    }

    postagensPopulares(): Postagem[]{
        let postagensPopulares: Postagem[] = []

        for(let p of this._repositorioDePostagens.postagens){
            if(p.ehPopular()){
                postagensPopulares.push(p)
            }
        }

        try{
            if(postagensPopulares.length == 0){
                throw new PostagemNaoEncontradaError('Não há postagens populares')
            }
        } catch(e: any) {
            if (e instanceof AplicacaoError) {
                console.log(e.message);
            }
        }

        return postagensPopulares;
    }

    excluirPostagem(idPostagem: number){
        let indice: number = this._repositorioDePostagens.consultarPorIndice(idPostagem);
        for(let i = indice; i < this._repositorioDePostagens.postagens.length; i++){
            this._repositorioDePostagens.postagens[i] = this._repositorioDePostagens.postagens[i+1];
        }
        this._repositorioDePostagens.postagens.splice(indice, 1);
    }

    editarNome(antigoNome: string, nomeNovo: string){
        try{
            let perfil = this.consultarPerfil(undefined, antigoNome);
            if(perfil) { 
                if (perfil.nome == nomeNovo) {
                    throw new PerfilExistenteError('O novo nome é igual ao antigo.')
                }
                perfil.nome = nomeNovo;
                this._repositorioDePerfis.atualizarPerfil(perfil); 
            }

            if(!perfil){
                throw new PerfilNaoEncontradoError('Perfil não encontrado.');
            }
        } catch (e:any){
            if(e instanceof AplicacaoError){
                console.log(e.message);
            }
        }
    }

    editarEmail(antigoEmail: string, emailNovo: string){
        try{
            let perfil = this.consultarPerfil(undefined, undefined, antigoEmail);
    
            if (perfil) {
                if (perfil.email == emailNovo) {
                    throw new PerfilExistenteError('O novo email é igual ao antigo.')
                }
                perfil.email = emailNovo;
                this._repositorioDePerfis.atualizarPerfil(perfil); 
            }

            if(!perfil){
                throw new PerfilNaoEncontradoError('Perfil não encontrado!');
            }
        } catch (e:any){
            if(e instanceof AplicacaoError){
                console.log(e.message);
            }
        }
    }
}
export{ RedeSocial };
