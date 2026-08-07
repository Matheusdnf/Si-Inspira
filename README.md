# SI Inspira - Projeto Acadêmico

Este é o repositório do site **SI Inspira**, uma plataforma digital desenvolvida para servir como acervo de materiais acadêmicos. O projeto apresenta livros publicados, tutoriais, cartilhas, vídeos, produtos técnicos, jogos didáticos e apresentações (PTTs) associados ao projeto.

## Como o Projeto Funciona

O site opera como um repositório dinâmico. Em vez de armazenar arquivos e mídias estáticas diretamente no código, ele se integra à API do **Google Drive**. 
Os arquivos de cada categoria (livros, jogos, vídeos, etc.) ficam salvos em pastas específicas no Google Drive. Quando um usuário acessa o site, o frontend faz uma requisição para a nossa API (Serverless Functions na Vercel), que por sua vez se autentica no Google Drive usando uma Service Account, lista os arquivos da pasta e retorna esses dados para serem exibidos na interface do usuário através de carrosséis interativos.

Dessa forma, a atualização do conteúdo do site (adicionar novos livros, tutoriais, etc.) é feita de forma orgânica, apenas adicionando ou removendo os arquivos diretamente nas pastas correspondentes do Google Drive, sem a necessidade de alterar o código-fonte ou realizar novos deploys da aplicação.

## Arquitetura do Projeto

O projeto é dividido em duas partes principais operando integradas através da plataforma **Vercel**:

1. **Frontend (Client-side):** 
   - Localizado na pasta `src/`.
   - É uma aplicação Vanilla (sem frameworks complexos como React ou Angular), utilizando HTML5, CSS3 e JavaScript.
   - O layout é construído com **Tailwind CSS** (via CDN) para uma estilização ágil e responsiva.
   - Utiliza a biblioteca **Swiper.js** para criar os carrosséis de itens e **FontAwesome** para a iconografia.
   - O arquivo `script.js` cuida da lógica de menu responsivo (Drawer) e realiza as requisições assíncronas (`fetch`) para os endpoints da API, populando a interface dinamicamente.

2. **Backend (Serverless API):**
   - Localizado na pasta `api/`.
   - Utiliza **Node.js** em formato de Serverless Functions da Vercel.
   - Cada arquivo (ex: `obter-livros.js`) é um endpoint independente responsável por consultar uma pasta específica no Google Drive utilizando a biblioteca oficial `googleapis`.
   - As rotas são reescritas de forma amigável através das configurações no arquivo `vercel.json` (ex: a requisição para `/api/livros` aponta internamente para a execução do script `obter-livros.js`).

## Tecnologias Utilizadas

* **HTML5, CSS3, JavaScript (ES6+)**: Base do Frontend.
* **Tailwind CSS (via CDN)**: Framework utilitário para estilização e design responsivo.
* **Swiper.js**: Biblioteca para os carrosséis de conteúdo (`sliders`).
* **FontAwesome**: Biblioteca de ícones.
* **Node.js**: Ambiente de execução para as funções de backend.
* **Google API Node.js Client (`googleapis`)**: SDK utilizado para interagir e buscar dados do Google Drive.
* **Vercel**: Plataforma de hospedagem e execução das Serverless Functions.

## Como Rodar e Contribuir Localmente

### Pré-requisitos
* Node.js instalado (versão 22 ou superior recomendada no `package.json`).
* Conta na Vercel e o Vercel CLI instalado globalmente (recomendado para testar a API localmente: `npm i -g vercel`).
* Credenciais de uma Service Account do Google com acesso de leitura às pastas do Drive do projeto.

### Passos para Inicialização

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd "si inspira"
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   - Crie um arquivo `.env` (ou `.env.local`) na raiz do projeto.
   - Adicione sua variável de ambiente do Google, contendo o JSON da sua Service Account:
     ```env
     GOOGLE_CREDENTIALS_JSON='{ "type": "service_account", "project_id": "...", ... }'
     ```

4. **Inicie o servidor de desenvolvimento:**
   - Para emular perfeitamente o ambiente de produção (integrando o frontend estático e as rotas da API serverless), utilize o Vercel CLI:
     ```bash
     vercel dev
     ```
   - O projeto estará acessível localmente (normalmente em `http://localhost:3000`).

## Manutenção e Novas Funcionalidades

### 1. Adicionando ou Removendo Conteúdo Existente
Para adicionar um novo livro, vídeo ou cartilha, não é necessário alterar o código do sistema. Basta acessar o Google Drive do projeto e inserir ou remover o arquivo na pasta correspondente. O site será atualizado automaticamente, respeitando o tempo de cache da API configurado nos headers da requisição.

### 2. Adicionando uma Nova Categoria de Conteúdo
Para adicionar uma nova seção (por exemplo, "Artigos Científicos"), siga os passos abaixo:

1. **No Backend:**
   - Crie um novo script na pasta `api/` (ex: `obter-artigos.js`). É possível duplicar a estrutura de `api/obter-livros.js` e alterar o valor da variável `folderId` para o identificador da nova pasta no Google Drive.
   - Atualize o arquivo `vercel.json` adicionando uma nova regra de redirecionamento no bloco `"rewrites"`:
     ```json
     { "source": "/api/artigos", "destination": "/api/obter-artigos" }
     ```

2. **No Frontend:**
   - No arquivo `src/index.html`, crie uma nova `<section>` baseada nas existentes (contendo um título e a estrutura do `swiper` onde os cards serão renderizados).
   - Adicione o link de âncora no menu lateral (Drawer) no HTML.
   - No arquivo `src/script.js`, crie um novo bloco de código para realizar o `fetch("/api/artigos")`, processar os dados recebidos e injetar o HTML dos cards dentro da nova estrutura criada, finalizando com a inicialização de uma nova instância da classe `Swiper`.

---
*Documentação oficial mantida pela equipe do projeto SI Inspira.*
