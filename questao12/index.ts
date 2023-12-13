import {AtributoVazioError, PerfilExistenteError, PerfilNaoEncontradoError, PostagemJaExisteError, PostagemNaoEncontradaError } from "./excecoes";
import * as fs from 'fs';

class Perfil{
    private _idPerfil: number;
    private _nome: string;
    private _email: string;
    private _postagensDoPerfil: Postagem[] = [];
    constructor(i:number, n:string, e:string){
        this._idPerfil = i;
        this._nome = n;
        this._email = e;
    }

    get idPerfil(): number{
        return this._idPerfil;
    }

    get nome(): string{
        return this._nome;
    }

    get email(): string{
        return this._email;
    }

    get postagensDoPerfil(): Postagem[] {
        return this._postagensDoPerfil;
    }

    set nome(nome: string){
        this._nome = nome
    }

    set email(email: string){
        this._email = email;
    }

    set idPerfil(id: number){
        this._idPerfil = id;
    }
}

class Postagem{
    private _idPostagem: number;
    private _texto: string;
    private _curtidas: number;
    private _descurtidas: number;
    private _data: Date = new Date();
    private _perfil: Perfil;
    constructor(i:number, t:string, p:Perfil, c: number, d: number){
        this._idPostagem = i;
        this._texto = t;
        this._perfil = p;
        this._curtidas = c;
        this._descurtidas = d
    }

    get idPostagem(): number{
        return this._idPostagem;
    }

    get texto(): string{
        return this._texto;
    }

    get curtidas(): number{
        return this._curtidas
    }

    get descurtidas(): number{
        return this._descurtidas
    }

    get data(): Date{
        return this._data
    }

    get perfil(): Perfil{
        return this._perfil;
    }

    set idPostagem(id: number){
        this._idPostagem = id;
    }

    curtir(): void{
        this._curtidas ++;
    }

    descurtir(): void{
        this._descurtidas ++;
    }

    ehPopular(): boolean{
        return this.curtidas > (this.descurtidas + this.descurtidas * (50/100));
    }
}

class PostagemAvancada extends Postagem{
    private _hashtags: string[] = [];
    private _visualizacoesRestantes: number = 1;
    constructor(i:number, t:string, p:Perfil, c: number, d: number){
        super(i, t, p, c, d);
    }

    get hashtags(): string[] {
        return this._hashtags;
    }

    get visualizacoesRestantes(): number {
        return this._visualizacoesRestantes;
    }

    set visualizacoesRestantes(v: number){
        this._visualizacoesRestantes = v
    }

    adicionarHashtag(hashtag:string): void{
        this.hashtags.push(hashtag);
    }

    existeHashtag(hashtag:string): boolean {
        let temHashtag = false;
        for(let h of this._hashtags){
            if(h == hashtag){
                temHashtag = true;
                break;
            }
        }
        return temHashtag;
    }

    decrementarVisualizacoes(): void { 
        if (this._visualizacoesRestantes > 0) {
            this._visualizacoesRestantes--;
        }
    }

    quantidadeDeVizualizaoes(): number{
        return 1000 - this.visualizacoesRestantes;
    }
}

interface IRepositorioDePerfis {
    get perfis(): Perfil[]; 
    incluirPerfil(perfil: Perfil): void;
    consultarPerfil(id?: number, nome?: string, email?: string): Perfil;
    atualizarPerfil(perfil: Perfil):void;
}

interface IRepositorioPostagens {
    get postagens(): Postagem[]; 
    consultarPorIndice(idPostagem: number): number;
    consultarPostagem(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Postagem[];
    consultarPostagemPorId(idPost: number): Postagem;
    incluirPostagem(postagem: Postagem): void;
    atualizarPostagem(postagem: Postagem):void;
}

class RepositorioDePerfisArquivo implements IRepositorioDePerfis {
    private arquivo: string;

    constructor(arquivo: string) {
        this.arquivo = arquivo;
    }

    get perfis(): Perfil[] {
        const dados = this.lerArquivo();
        return dados.map((d: any) => new Perfil(d._idPerfil, d._nome, d._email));
    }

    incluirPerfil(perfil: Perfil): void {
        if (perfil.nome && perfil.email) {
            const dados = this.lerArquivo();
            const perfilExiste = this.perfis.find(p => 
                (p.idPerfil == perfil.idPerfil) ||
                (p.nome == perfil.nome) ||
                (p.email == perfil.email))
                    
            if (perfilExiste) {
                throw new PerfilExistenteError('O perfil já existe');
            }

            perfil.idPerfil = dados.length + 1;  
            dados.push(perfil);
            this.salvarArquivo(dados);
            
        } else {
            throw new AtributoVazioError('Os atributos precisam ser preenchidos!');
        }
    }
    
    consultarPerfil(id?: number, nome?: string, email?: string):Perfil {
        const dados = this.lerArquivo();

        const perfilEncontrado = dados.find((d: any) => {
            return (
                (id != undefined && d._idPerfil == id) ||
                (nome != undefined && d._nome == nome) ||
                (email != undefined && d._email == email)
            );
        });

        if (!perfilEncontrado) {
            throw new PerfilNaoEncontradoError('Perfil não encontrado!');
        }
        
        return new Perfil(perfilEncontrado._idPerfil, perfilEncontrado._nome, perfilEncontrado._email);
    }

    private lerArquivo(): any[] {
        const conteudo = fs.readFileSync(this.arquivo, 'utf-8');
        return JSON.parse(conteudo);
    }

    private salvarArquivo(dados: any[]): void {
        fs.writeFileSync(this.arquivo, JSON.stringify(dados, null, 2), 'utf-8');
    }

    atualizarPerfil(perfil: Perfil):void{ 
        let dados = this.lerArquivo();
        let perfilExiste = this.perfis.find(p =>(p.idPerfil === perfil.idPerfil));
        
        if (!perfilExiste) {
            throw new PerfilExistenteError('O perfil já existe');
        }

        let index = this.perfis.findIndex(p => p.idPerfil == perfil.idPerfil);
        if (index != -1) {
            this.perfis[index] = perfil;
            dados[index] = perfil;
            this.salvarArquivo(dados);
        }
    }
}

class RepositorioDePostagensArquivo implements IRepositorioPostagens {
    private arquivo: string ;

    constructor(arquivo: string) {
        this.arquivo = arquivo;
    }

    private lerArquivo(): any[] {
        let conteudo = fs.readFileSync(this.arquivo, 'utf-8');
        return JSON.parse(conteudo);  
    }

    private salvarArquivo(dados: any[]): void {
        fs.writeFileSync(this.arquivo, JSON.stringify(dados, null, 2), 'utf-8');
    }

    get postagens(): Postagem[] {
        return this.lerArquivo();
    }

    consultarPostagem(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Postagem[] {
        let dados = this.lerArquivo();
        const postagensFiltradas = dados
            .filter((d: any) => {
                return (
                    (id == undefined || d._idPostagem == id) &&
                    (texto == undefined || d._texto.includes(texto)) &&
                    (perfil == undefined || d._perfil == perfil) &&
                    (hashtag == undefined || (d._hashtags && d._hashtags.includes(hashtag)))
                );
            });

        if (postagensFiltradas.length === 0) {
            throw new PostagemNaoEncontradaError('Postagem não encontrada');
        }

        return postagensFiltradas.map((dados: any) => dados);
    }

    incluirPostagem(postagem: Postagem): void {
        const dados = this.lerArquivo();
    
        if (postagem.texto.trim() && postagem.perfil) {
            postagem.idPostagem = dados.length + 1;  // Atualiza o ID da postagem
            dados.push(postagem);
            this.salvarArquivo(dados);
        } else {
            throw new AtributoVazioError('Todos os atributos da postagem devem estar preenchidos!');
        }
    }    

    consultarPorIndice(idPostagem: number): number {
        const dados = this.lerArquivo();
        const indice = dados.findIndex((d: any) => d._idPostagem === idPostagem);

        if(indice == -1){
            throw new PostagemNaoEncontradaError('Postagem não encontrada');
        }
        
        return indice;
    }

    consultarPostagemPorId(idPost: number): Postagem {
        const dados = this.lerArquivo();
        const postagemProcurada = dados.find((d: any) => d._idPostagem === idPost);
        
        if(postagemProcurada == undefined){
            throw new PostagemNaoEncontradaError('Postagem não encontrada');
        }
        
        this.salvarArquivo(dados);
        return postagemProcurada;
    } 

    atualizarPostagem(postagem: Postagem): void {
        let dados = this.lerArquivo();
        let postagemExiste = this.postagens.find(p => p.idPostagem === postagem.idPostagem);
    
        if (!postagemExiste) {
            throw new PostagemNaoEncontradaError('Postagem não encontrada.');
        }
    
        let index = this.postagens.findIndex(p => p.idPostagem === postagem.idPostagem);
        if (index != -1) {
            this.postagens[index] = postagem;
            dados[index] = postagem;
            this.salvarArquivo(dados);
        }
    
        // atualiza as visualizações se a postagem for do tipo PostagemAvancada
        if (postagem instanceof PostagemAvancada) {
            this.decrementarVisualizacoes(postagem);
        }
    }
    
    private decrementarVisualizacoes(postagem: PostagemAvancada): void {
        if (postagem.visualizacoesRestantes > 0) {
            postagem.visualizacoesRestantes--;
        }
    }
}

export { Perfil, Postagem, PostagemAvancada, IRepositorioDePerfis, IRepositorioPostagens, RepositorioDePerfisArquivo, RepositorioDePostagensArquivo }
