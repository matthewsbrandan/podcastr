# PODCASTR

## Iniciando Projeto
    - Criando projeto com next
        - npx create-next-app podcastr
    - Adicionando Typescript
        - yarn add typescript @types/react @types/node -D
            - @types/react e @types/node são as integrações das linguagens/bibliotecas com o TS
    - Adicionando SASS
        - yarn add sass
    - Importando fonts.
        - Criar um arquivo chamado _document.tsx, pois ele será carregado apenas uma vez, diferente do arquivo _app, que apesar de estar encapsulando todos os componentes ele é recarregado toda vez que troca de página.
    - Instalando Biblioteca para lidar com Datas
        - yarn add date-fns
    - Instalando Biblioteca para criar uma API fake apartir de um arquivo JSON
        - yarn add json-server -D
        - Para rodar o servidor desta API fake precisamos criar mais uma linha no script do package.json
            - "server": "json-server server.json -w -d 750 -p 3333"
                - w: WatchMode | Sempre que trocarmos uma informação dentro desse servidor ele vai reiniciar
                - d 750: Daley | Simula a demora de processamento, para simularmos o atraso que uma api em produção normalmente teria. O tempo é dado em ms.
                - p 3333: porta em que a api irá rodar.
                - Para rodar a aplicação basta rodar o comando com o nome que você deu no script:
                    - yarn server

## Deploy
    - yarn build: gera a versão que será exportada para o servidor 

## Rodando a aplicação

*yarn dev* Roda o programa em ambiente de densenvolvimento.
*yarn start* Roda o programa como se estivesse em produção (para rodar este comando, antes você deve ter executado o comando yarn build, especificado acima no tópico de deploy da aplicação).

## Formatos de Requisição a API

### SPA
    - SPA (Single Page Application): Neste formato a requisição será feita quando a página for carregada. O ponto negativo deste método é que ele não é indexável pelo google(Não é recomendado para SEO), pois os crawlers não vão esperar finalizar a requisição da página, que é feita do lado do Browser.
        useEffect(()=> {
            fetch('http://localhost:3333/episodes')
            .then(response => response.json())
            .then(data => console.log(data))
        },[]);
### SSR
    - SSR (Server Side Rendering): Para utilizar este formato você deve criar e exportar uma função (fora da função que retorna o componente) com o nome getServerSideProps(), desta forma a requisição será feita do lado do servidor, e assim os crawlers conseguiram indexar seus dados. O ponto negativo deste método é que isso é executado toda vez que alguém carrega a página, e neste caso específico, sabemos que a página irá mudar no máximo uma vez por dia.
        export default function MyComponent(props) { ... }
        export async function getServerSideProps(){
            const response = await fetch('http://localhost:3333/episodes');
            const data = await response.json();
            
            return {
                props: {
                    episodes: data,
                }
            }
        }
### SSG
    - SSG (Server Site Generation): Neste método, assim que uma pessoa acessa essa página, geramos uma versão estática dela, que é um html puro, que será servido para todas as pessoas seguintes, sendo assim, em vez de fazer inúmeros requisições a api retornando a mesma coisa, iremos fazer apenas 1. Para implementar, basta replicar o código de cima alterando de getServerSideProps para getStaticProps e adicionando um atributo a mais no return que é o revalidate(tempo em segundos), o intervalo em que essa página será gerada novamente.
        export default function MyComponent(props) { ... }
        export async function getStaticProps(){
            const response = await fetch('http://localhost:3333/episodes');
            const data = await response.json();
            
            return {
                props: {
                    episodes: data,
                },
                revalidate: 60 * 60 * 8 // Correspondente a 8h
            }
        }
    - A melhor forma de tipar o comando acima é transformando a função em constante e importando uma propriedade do next chamada GetStaticProps.
        export const getStaticProps: GetStaticProps = async () => { ... }
    - Alterando requisição de fetch para axios. Vantagens do axios: podemos criar uma baseUrl, definir de forma simples o modo de envio e podemos passar os parametros como um objeto javascript.
        const { data } = await api.get('episodes', { params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc'
        }});
#### Páginas Estáticas Dinâmicas
    - Páginas Estáticas. Este conceito é utilizado quando, diferente do caso de cima que é apenas uma página, temos N páginas a serem geradas estaticamente.

#### Função getStaticPaths
    - Esta função é necessária, pois o principal momento em que o next carrega as páginas estáticas é na hora da build, e como estamos falando de geração dinâmica de páginas estáticas, utilizamos essa função para determinar como o next irá se comportar.
    - Quando o parametro paths estiver vazio, o next não carregara nada no momento da build, mas caso você quiser que ele carregue alguma página previamente você precisa declarar a chave do elemento.
        - paths: [{ params: { slug: 'a-importancia-da-...'} }]
            - foi passado params e slug, pois é com esses dados que fazemos a requisição a api.
    - O parametro fallback determinará o que o sistema fará quando carregar uma página que ainda não foi gerada estaticamente.

*fallback: false* Se a opção estiver como false, as páginas que não foram geradas estaticamente retornarão o erro 404.
*fallback: true* Nesta opção, caso não haja a versão estática da página ele tentará fazer a requisição e gerar a página, porém executando isso no lado do browser.    
*fallback: 'bloking'* Semelhante a opção true, porém com seu grande diferencial sendo o carregamento do lado do next, o que é o mais indicado para questões de SEO.

    - Parametros true e blocking são chamados no next de 'incremental static regeneration'.

## Novos Conhecimentos

**CSS**
    - Unidade de medida rem.
        - REM é um valor relativo ao componente root(html), ou seja, alterando o font-size do html ele alterará o tamanho de todos elementos que utilizam rem. Lembrando que por padrão o font-size é 16px
    - text-transform: capitalize
        - Torna a primeira letra de cada palavra maiúscula
    - font-size: 0 no button quando há apenas imagem dentro.
        - Porque assim a imagem ficará centralizada dentro do botão
    - text-overflow: ellipsis;
        - Isso adiciona ... quando não couber mais o texto.
    - alterando a cor de um svg
        - filter: invert(0.35) sepia(1) saturate(3) hue-rotate(100deg);
**date-fns**
    - Biblioteca para lidar com datas. Para saber mais informações sobre como formatar as strings na documentação da biblioteca tem todos os formatos disponíveis.
    - Definir locale. Para definir o idioma passamos o parametro locale: ptBR, e esse ptBR deveremos importar com o seguinte comando:
        - import ptBR from 'date-fns/locale/pt-BR'
        - format(data,'d MMM yy', {locale: ptBR})
    - parseISO
        - Converte uma data em string e converte para o date do JS.

**next/image**
    - O Componente Image, que é importado do next ele tem uma funcionalidade muito interessante que são as propriedades width e height, que não se refere ao tamanho que será exibida na tela, mas sim o tamanho do arquivo que será renderizado, ou seja, não importa se a imagem vem em 2000px se você colocar 192px, ele carregara apenas 192px.
        - <Image width={192} height={192} src={episode.thumbnail} alt={episode.title}/>

**roteamento | next**
    - Com o next, o roteamento é automático, cada página dentro da pasta pages é acessível pelo url, exceto, páginas començando com _ (que é o caso de _app e _document).
    - Para trabalharmos com o conceito de URL amigável fazemos da seguinte maneira.
        - Ao envéz de passarmos os parametros por get da forma tradicional(utilizando ?) usamos a barra (/).
        - Ao envéz de utlizarmos um arquivo diretamente, utilizamos uma pasta, e dentro dessa pasta colocaremos o arquivo que será chamado.
        - O nome do arquivo deve estar da seguinte maneira, onde slug é um nome qualquer que você quer dar para a variável para poder chamar seu conteúdo futuramente.
            - [slug].tsx
    - Outro ponto que é importante ressaltar é não utilizar apenas a acora(a) para o roteamento interno, pois a ancora faz com que o carregamento acontece do zero. Para solucionar este problema basta importar o componente Link de 'next/link' e envolver a tag (a) com ele colocando o href do (a) no Link, da seguinte maneira.
        import Link from 'next/link'
        <Link href="#"><a>Link</a></Link>
**dangerouslySetInnerHTML**
    - Injetar HTML de uma variável JS.
        - Temos que utilizar esse atributo, pois por padrão o react bloqueia a injeção de html por variáveis, mas caso seja necessário siga o código da implementação abaixo.
            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description}}/>

**Aguardar Carregamento**
    - Importação
        - import { useRouter } from 'next/router';
    - Declaração
        - const router = useRouter();
    - Implementação
        - if(router.isFallback){
            - return <p>Carregando...</p>
        - }

**Slider**
    - yarn add rc-slider

**Contexto**
    - Para diminuir as importações na hora de chamar um contexto, podemos criar uma função que ao mesmo tempo que passa o contexto, também passa o useContext, desta forma podemos chamar apenas o nome da função.
        - export const usePlayer = () => {
            - return useContext(PlayerContext);
        - }
        - const chamarContexto = usePlayer();

## Boas práticas
    - Muitos dados precisam ser formatados antes de ser exibidos em tela, como exemplo data, e para que não sejam gerados processamentos desnecessárias toda vez que o componente for renderizado o ideal é que essa formatação seja feita antes de chegar ao componente.

## Códigos das aulas
*#missaoespacial*
*#embuscadoproximonivel*
*#astronautas*
*#universoinfinito*
*#missaocumprida*

## NEXT LEVEL

**Responsividade**
    - Trabalhar com responsividade

**PWA**
    - next/pwa

**DarkTheme**
    - Criar o tema dark
    - No github omni-theme da rocketseat tem uma palheta de cores que pode ser utilizada.