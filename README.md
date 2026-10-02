<<<<<<< HEAD
# Si Inspira

Repositório do site Si Inspira: um catálogo dinâmico de conteúdos (livros, tutoriais, vídeos, jogos, produtos) hospedado na Vercel e alimentado por pastas do Google Drive.

## Como o Projeto Funciona

O site opera como um repositório dinâmico. Em vez de armazenar arquivos e mídias estáticas diretamente no código, ele se integra à API do Google Drive. Os arquivos de cada categoria (livros, jogos, vídeos, etc.) ficam salvos em pastas específicas no Google Drive. Quando um usuário acessa o site, o frontend faz uma requisição para a nossa API, que se autentica no Google Drive usando uma Service Account, lista os arquivos da pasta e retorna esses dados para serem exibidos na interface do usuário através de carrosséis interativos.

Dessa forma, a atualização do conteúdo do site (adicionar novos livros, tutoriais, etc.) é feita de forma orgânica: basta adicionar ou remover os arquivos diretamente nas pastas correspondentes do Google Drive, sem necessidade de alterar o código-fonte ou realizar novos deploys da aplicação.

## Arquitetura do Projeto

O projeto é dividido em duas partes principais, operando integradas através da plataforma Vercel:

- **Frontend** (`src/`): HTML + CSS (Tailwind) + JS puro, servido como estático (`outputDirectory: src` no `vercel.json`).
- **Backend** (`api/`): Serverless Functions (Node.js) que buscam os arquivos no Google Drive via `googleapis` e retornam JSON para o frontend consumir.

### Tecnologias Utilizadas

- **HTML5, CSS3, JavaScript**
- **Tailwind CSS** — framework utilitário para estilização e design responsivo
- **Node.js** — ambiente de execução das funções de backend
- **Google API Node.js Client (`googleapis`)** — SDK para interagir e buscar dados do Google Drive
- **Vercel** — hospedagem e execução das Serverless Functions

## Como Rodar Localmente

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão 22)
- Conta na Vercel e o [Vercel CLI](https://vercel.com/docs/cli) instalado globalmente (recomendado para testar a API localmente):
  ```bash
  npm i -g vercel
  ```
- Acesso à Service Account do Google Cloud usada no projeto (peça as credenciais a quem administra o projeto)

### 2. Clonar o repositório

```bash
git clone https://github.com/Matheusdnf/Si-Inspira.git
cd Si-Inspira
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Configurar variáveis de ambiente

As chamadas à API do Google Drive exigem credenciais, protegidas por variáveis de ambiente. Crie **dois arquivos** na raiz do projeto: `.env` e `.env.local`, ambos com o mesmo conteúdo:

```
GOOGLE_CREDENTIALS_JSON='<conteúdo do JSON da Service Account, em uma linha só>'
GOOGLE_DRIVE_FOLDER_ID="<id da pasta raiz no Google Drive>"
```

> ⚠️ **Nunca commite esses arquivos.** Confirme que `.env` e `.env.local` estão no `.gitignore` antes de rodar `git add`. Se uma chave privada real for exposta em algum commit (ou README), rotacione-a imediatamente no [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts).

Alternativa recomendada: usar o Vercel CLI para puxar as variáveis já configuradas no projeto:

```bash
vercel link
vercel env pull .env.local
```

### 5. Rodar o projeto

```bash
vercel dev
```

Isso sobe o frontend estático (`src/`) e as funções serverless (`api/`) juntos, simulando o ambiente de produção da Vercel.

## Manutenção e Novas Funcionalidades

### 1. Adicionando ou Removendo Conteúdo Existente

Para adicionar um novo livro, vídeo ou cartilha, **não é necessário alterar o código**. Basta acessar o Google Drive do projeto e inserir ou remover o arquivo na pasta correspondente. O site é atualizado automaticamente, respeitando o tempo de cache configurado nos headers da requisição.

### 2. Adicionando uma Nova Categoria de Conteúdo

Para adicionar uma nova seção (ex.: "Artigos Científicos"), siga os passos:

**No Backend:**

1. Crie um novo script na pasta `api/` (ex.: `obter-artigos.js`). Pode duplicar a estrutura de `api/obter-livros.js` e alterar o valor da variável `folderId` para o identificador da nova pasta no Google Drive.
2. Atualize o `vercel.json`, adicionando uma nova regra em `"rewrites"`:
   ```json
   { "source": "/api/artigos", "destination": "/api/obter-artigos" }
   ```

**No Frontend:**

1. Em `src/index.html`, crie uma nova `<section>` baseada nas existentes (título + estrutura do Swiper onde os cards serão renderizados).
2. Adicione o link de âncora correspondente no menu lateral (Drawer).
3. Em `src/script.js`, crie um bloco para fazer `fetch("/api/artigos")`, processar os dados recebidos, injetar o HTML dos cards na nova seção e inicializar uma nova instância da classe `Swiper`.

## Deploy

O deploy é feito via Vercel, a partir do branch `main`:

```bash
vercel        # gera um preview deployment
vercel --prod # publica em produção
```

Certifique-se de que `GOOGLE_CREDENTIALS_JSON` e `GOOGLE_DRIVE_FOLDER_ID` estejam configuradas no painel da Vercel (Project Settings → Environment Variables) antes do primeiro deploy.
=======

>>>>>>> 2fdc26b49f73a5ec592a73c3fe686317ce1f6ae2
