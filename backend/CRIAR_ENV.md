# 🔧 Como Criar o Arquivo .env

O arquivo `.env` é necessário para configurar as credenciais do banco de dados.

## Passo a Passo:

### 1. No PowerShell, navegue até a pasta backend:
```powershell
cd backend
```

### 2. Crie o arquivo .env copiando o exemplo:
```powershell
Copy-Item .env.example .env
```

### 3. Edite o arquivo .env com suas credenciais do MySQL:

**IMPORTANTE:** Você precisa configurar a senha do seu MySQL!

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SUA_SENHA_MYSQL_AQUI
DB_NAME=growtrack

JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development
```

### 4. Substitua `SUA_SENHA_MYSQL_AQUI` pela senha do seu MySQL

**Se você não tem senha no MySQL:**
- Deixe `DB_PASSWORD=` vazio (sem nada depois do =)
- OU configure uma senha no MySQL primeiro

**Se você esqueceu a senha do MySQL:**
- Você pode redefinir a senha do MySQL
- OU criar um novo usuário com senha

### 5. Verifique se o MySQL está rodando:
```powershell
# No PowerShell, teste a conexão:
mysql -u root -p
```

### 6. Certifique-se de que o banco de dados existe:
```sql
-- Acesse o MySQL:
mysql -u root -p

-- Execute:
CREATE DATABASE IF NOT EXISTS growtrack;
```

### 7. Execute o script de criação das tabelas:
```sql
-- Ainda no MySQL:
USE growtrack;
SOURCE database/schema.sql;
```

### 8. Reinicie o servidor Node.js:
```powershell
# Pare o servidor (Ctrl+C) e inicie novamente:
npm run dev
```

## ⚠️ Problemas Comuns:

### Erro: "Access denied for user 'root'@'localhost'"
- **Solução:** Verifique se a senha no `.env` está correta
- Se não tem senha, deixe `DB_PASSWORD=` vazio

### Erro: "Unknown database 'growtrack'"
- **Solução:** Execute o script `database/schema.sql` para criar o banco

### Erro: "Can't connect to MySQL server"
- **Solução:** Verifique se o MySQL está rodando
- No Windows: Verifique no "Serviços" se o MySQL está iniciado

