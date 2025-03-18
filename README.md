# Projeto Full Stack - Teste DSIN

Este é um projeto full stack que consiste em uma aplicação web desenvolvida com Angular no frontend e Node.js com Express no backend.

## Tecnologias Utilizadas

### Frontend (Client)
- **Angular 19.1.0**: Framework JavaScript para construção da interface do usuário
- **TailwindCSS 4.0.14**: Framework CSS para estilização
- **RxJS 7.8.0**: Biblioteca para programação reativa
- **TypeScript 5.7.2**: Superset tipado do JavaScript

### Backend (Server)
- **Node.js com Express 4.21.1**: Framework web para Node.js
- **Prisma**: ORM (Object-Relational Mapping) para banco de dados
- **TypeScript 5.6.3**: Linguagem de programação
- **Outras dependências importantes**:
  - bcrypt: Para criptografia de senhas
  - jsonwebtoken: Para autenticação JWT
  - cors: Para controle de acesso cross-origin
  - helmet: Para segurança da aplicação
  - dotenv: Para gerenciamento de variáveis de ambiente

## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão recomendada: 18.x ou superior)
- NPM ou Yarn como gerenciador de pacotes
- Git para clonar o repositório

### Configuração do Backend (pasta server)

1. Entre na pasta do servidor:
```bash
cd server
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` baseado no exemplo fornecido
- Configure as variáveis necessárias (banco de dados, chaves JWT, etc.)

4. Execute as migrações do Prisma:
```bash
npm run prisma
```

5. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000` (ou na porta definida no .env)

### Configuração do Frontend (pasta client)

1. Entre na pasta do cliente:
```bash
cd client
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`

## Estrutura do Projeto

- `/client`: Contém todo o código do frontend em Angular
- `/server`: Contém todo o código do backend em Node.js
  - `/src`: Código fonte principal
  - `/prisma`: Schemas e migrações do banco de dados

## Observações Importantes

- Certifique-se de que todas as variáveis de ambiente necessárias estejam configuradas corretamente
- O backend deve estar rodando para que o frontend funcione corretamente
- Para ambiente de produção, utilize os comandos de build apropriados:
  - Frontend: `npm run build`
  - Backend: `npm run build` 