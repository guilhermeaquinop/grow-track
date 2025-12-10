# Dados de Teste (Modo JSON)

Este diretório contém os dados armazenados quando a aplicação está rodando em modo JSON (sem banco de dados MySQL).

## Como Funciona

Quando o banco de dados MySQL não está disponível ou não está configurado, a aplicação automaticamente usa o arquivo `mock-data.json` para armazenar todos os dados.

## Estrutura do Arquivo

O arquivo `mock-data.json` contém três arrays principais:

- **users**: Usuários cadastrados
- **habits**: Hábitos criados
- **habit_completions**: Registros de conclusão de hábitos

## Notas Importantes

- Os dados são salvos automaticamente a cada operação
- Este arquivo é ignorado pelo Git (veja `.gitignore`)
- Os dados são temporários e serão perdidos se você deletar o arquivo
- Para uso em produção, configure o banco de dados MySQL

## Exemplo de Dados Iniciais

O arquivo vem com dados de exemplo para facilitar os testes:
- Usuário: `teste@example.com` (senha: `teste123`)
- 2 hábitos de exemplo
- Algumas conclusões de exemplo

