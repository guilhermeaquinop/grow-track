📋 README - GROWTRACK
=====================

🎯 Nome do Sistema
GrowTrack - Plataforma de Controle de Hábitos

👨‍💻 Desenvolvedor
Guilherme de Aquino Pacheco
Matrícula: 20240065633

📋 Sobre o Projeto
==================

O GrowTrack é uma plataforma web voltada ao acompanhamento de hábitos de saúde, 
produtividade, finanças, estudos, bem-estar ou lazer. O sistema permite que o 
usuário crie metas e registre seu progresso de forma simples e visual, 
acompanhando a consistência ao longo do tempo por meio de gráficos e indicadores.

📸 Screenshots do Sistema
==========================

Todas as screenshots estão disponíveis na pasta docs/screenshots/:

• Landing Page: docs/screenshots/landing-page.png
• Página de Login: docs/screenshots/login.png
• Página de Cadastro: docs/screenshots/cadastro.png
• Dashboard: docs/screenshots/dashboard.png
• Lista de Hábitos: docs/screenshots/lista-habitos.png
• Cadastro de Hábito: docs/screenshots/cadastro-habito.png

🚀 Tecnologias
==============

• Frontend: Next.js 14 (App Router), React, Tailwind CSS
• Backend: Node.js, Express.js
• Banco de Dados: MySQL (com fallback para JSON em modo de teste)
• Autenticação: JWT (JSON Web Tokens)
• Outras: bcrypt, axios, chart.js

📁 Estrutura do Projeto
========================

growtrack/
├── backend/          # API Node.js/Express
│   ├── config/       # Configurações (banco de dados)
│   ├── controllers/  # Lógica de negócio
│   ├── middleware/   # Middlewares (auth, validação)
│   ├── models/       # Modelos de dados
│   ├── routes/       # Rotas da API
│   └── utils/        # Utilitários
├── frontend/         # Aplicação Next.js
│   ├── app/          # App Router (páginas)
│   ├── components/    # Componentes React
│   ├── context/       # Context API
│   ├── hooks/         # Custom hooks
│   ├── services/      # Serviços (API calls)
│   └── styles/        # Estilos globais
├── database/         # Scripts SQL
│   ├── schema.sql    # Schema do banco
│   └── seed.sql      # Dados de teste
└── docs/             # Documentação

🚀 Como Começar
===============

OPÇÃO 1: Modo Desenvolvimento (com banco de dados)
---------------------------------------------------

1. Abra o arquivo index.html em qualquer navegador moderno
2. Navegue pelas páginas usando o menu superior
3. Teste a responsividade redimensionando a janela

OPÇÃO 2: Modo Completo (Backend + Frontend)
--------------------------------------------

Veja a seção "🛠️ Instalação e Configuração" abaixo.

📱 Páginas Implementadas
========================

✅ index.html - Landing Page
   • Página inicial com apresentação do sistema
   • Seção hero com call-to-action
   • Cards de benefícios e funcionalidades
   • Design responsivo e moderno
   
   📸 Screenshot: docs/screenshots/landing-page.png

✅ login.html - Página de Login
   • Formulário de autenticação
   • Validação HTML5 (email, senha)
   • Link para cadastro e recuperação
   • Preview de estatísticas do usuário
   
   📸 Screenshot: docs/screenshots/login.png

✅ cadastro.html - Página de Cadastro
   • Formulário completo de registro
   • Validação de confirmação de senha
   • Checkbox de termos e newsletter
   • Dicas visuais de benefícios
   
   📸 Screenshot: docs/screenshots/cadastro.png

✅ dashboard.html - Dashboard Principal
   • Resumo de estatísticas pessoais
   • Gráfico de progresso dos últimos 7 dias
   • Lista de hábitos do dia atual
   • Ações rápidas para marcar conclusões
   
   📸 Screenshot: docs/screenshots/dashboard.png

✅ listagem.html - Lista de Hábitos
   • Tabela completa de todos os hábitos
   • Filtros por categoria e status
   • Ações de editar e excluir
   • Modal de confirmação para exclusões
   
   📸 Screenshot: docs/screenshots/lista-habitos.png

✅ novo-habito.html - Criar Novo Hábito
   • Formulário completo de criação
   • Seção de dicas para hábitos duradouros
   • Exemplos interativos de hábitos populares
   • Validação e feedback visual
   
   📸 Screenshot: docs/screenshots/cadastro-habito.png

✅ detalhe.html - Detalhes do Hábito
   • Visualização completa do hábito
   • Formulário de edição com toggle
   • Ações rápidas minimalistas
   • Histórico com calendário visual

🎨 Características Técnicas
===========================

• Design responsivo (mobile, tablet, desktop)
• Paleta de cores consistente (azul #2F80ED, verde #10B981)
• Tipografia Inter do Google Fonts
• Componentes reutilizáveis e modulares
• Estados visuais (hover, focus, active)
• Acessibilidade básica (labels, alt, foco)
• Validação HTML5 nos formulários
• JavaScript para interações simples

🔧 Funcionalidades Implementadas
================================

• Navegação completa entre todas as páginas
• Formulários com validação e feedback
• Modais de confirmação para ações destrutivas
• Estados visuais para botões e links
• Design minimalista e moderno
• Feedback visual para ações do usuário
• Layout responsivo adaptativo

🛠️ Instalação e Configuração
==============================

Pré-requisitos
--------------

• Node.js 18+ instalado
• MySQL 8.0+ instalado e rodando (opcional - pode usar modo JSON)
• npm ou yarn

1. Clone o repositório
----------------------

```bash
git clone https://github.com/seu-usuario/growtrack-platform.git
cd growtrack-platform
```

2. Configuração do Banco de Dados (Opcional)
---------------------------------------------

Se você tiver MySQL instalado e quiser usar o banco de dados:

```bash
# Acesse o MySQL
mysql -u root -p

# Execute o script de criação
source database/schema.sql

# (Opcional) Execute o script de seed para dados de teste
source database/seed.sql
```

**Nota:** O seed.sql contém um hash de senha de exemplo. Para criar usuários 
reais, use a funcionalidade de registro da aplicação.

Se você NÃO tiver MySQL ou não quiser configurá-lo agora:
- A aplicação automaticamente usará um arquivo JSON para testes locais
- Veja a seção "📝 Modo de Teste com JSON" abaixo

3. Configuração do Backend
--------------------------

```bash
cd backend
npm install

# Crie o arquivo .env
# Windows (PowerShell):
Copy-Item .env.example .env

# Linux/Mac:
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais (se usar MySQL):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=growtrack

JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development
```

**Importante:** Se você não configurar o banco de dados ou houver erro de 
conexão, a aplicação automaticamente usará o modo JSON para testes.

4. Configuração do Frontend
---------------------------

```bash
cd frontend
npm install

# Crie o arquivo .env.local
# Windows (PowerShell):
New-Item -ItemType File -Path .env.local

# Linux/Mac:
touch .env.local
```

Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

5. Executar o Projeto
---------------------

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

A aplicação estará rodando em `http://localhost:3000`

🎯 Primeiros Passos
===================

1. Acesse `http://localhost:3000`
2. Clique em "Cadastro" para criar uma conta
3. Faça login com suas credenciais
4. Comece criando seus primeiros hábitos!

📝 Modo de Teste com JSON
=========================

A aplicação possui um sistema de fallback automático. Se o banco de dados MySQL 
não estiver disponível ou não estiver configurado, a aplicação automaticamente 
utilizará um arquivo JSON (`backend/data/mock-data.json`) para armazenar os dados.

Isso permite:
• Testar a aplicação sem precisar configurar MySQL
• Desenvolvimento rápido sem dependências de banco
• Demonstrações e testes locais

Os dados em JSON são temporários e serão perdidos ao reiniciar o servidor, 
exceto se você salvar manualmente o arquivo.

📚 Endpoints da API
===================

Autenticação
------------
• POST /api/auth/register - Cadastro de usuário
• POST /api/auth/login - Login
• POST /api/auth/logout - Logout

Hábitos
-------
• GET /api/habits - Listar hábitos do usuário
• POST /api/habits - Criar novo hábito
• PUT /api/habits/:id - Editar hábito
• DELETE /api/habits/:id - Excluir hábito
• POST /api/habits/:id/complete - Marcar hábito como concluído

Dashboard
---------
• GET /api/dashboard - Dados do dashboard
• GET /api/dashboard/history - Histórico completo

🔧 Solução de Problemas
=======================

Erro de conexão com o banco de dados
-------------------------------------
• Verifique se o MySQL está rodando
• Confirme as credenciais no arquivo `.env` do backend
• Certifique-se de que o banco `growtrack` foi criado
• Se não quiser usar MySQL agora, a aplicação usará JSON automaticamente

Erro de CORS
------------
• Verifique se o `NEXT_PUBLIC_API_URL` no frontend está correto
• Certifique-se de que o backend está rodando na porta 5000

Erro ao instalar dependências
------------------------------
• Tente limpar o cache: `npm cache clean --force`
• Delete `node_modules` e `package-lock.json` e reinstale

📝 Observações Relevantes
=========================

• A aplicação suporta dois modos: MySQL (produção) e JSON (testes)
• Design focado em usabilidade e experiência do usuário
• Código limpo e bem estruturado
• Compatível com navegadores modernos
• Em produção, altere o `JWT_SECRET` para um valor seguro e aleatório
• Não commite arquivos `.env` ou `.env.local` no repositório

🌐 Navegadores Suportados
=========================

• Chrome (recomendado)
• Firefox
• Edge
• Safari

📄 Licença
==========

Este projeto foi desenvolvido para fins acadêmicos.

📞 Contato
==========

Desenvolvido por: Guilherme de Aquino Pacheco
Matrícula: 20240065633
Projeto: GrowTrack - Plataforma de Controle de Hábitos

---
© 2025 GrowTrack - Todos os direitos reservados
