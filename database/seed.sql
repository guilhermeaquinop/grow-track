-- GrowTrack Database Seed Data
-- Dados de teste para desenvolvimento

USE growtrack;

-- Inserir usuário de teste
-- Senha: "senha123" (hash bcrypt)
INSERT INTO users (name, email, password) VALUES
('Marina Silva', 'marina@teste.com', '$2b$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q'),
('João Santos', 'joao@teste.com', '$2b$10$rK8Q8Q8Q8Q8Q8Q8Q8Q8Q8O8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q')
ON DUPLICATE KEY UPDATE name=name;

-- Obter IDs dos usuários
SET @marina_id = (SELECT id FROM users WHERE email = 'marina@teste.com');
SET @joao_id = (SELECT id FROM users WHERE email = 'joao@teste.com');

-- Inserir hábitos de teste para Marina
INSERT INTO habits (user_id, name, description, category, frequency, goal) VALUES
(@marina_id, 'Beber água', 'Beber pelo menos 8 copos de água por dia', 'saude', 'diario', '8 copos'),
(@marina_id, 'Exercícios', 'Fazer pelo menos 30 minutos de atividade física', 'saude', 'diario', '30 minutos'),
(@marina_id, 'Leitura', 'Ler pelo menos 20 páginas de um livro', 'estudos', 'diario', '20 páginas'),
(@marina_id, 'Meditação', 'Praticar meditação por 10 minutos', 'pessoal', 'diario', '10 minutos'),
(@marina_id, 'Dormir cedo', 'Dormir entre 22h e 7h', 'saude', 'diario', '22h - 7h'),
(@marina_id, 'Economizar', 'Guardar R$ 20,00 por dia', 'financeiro', 'diario', 'R$ 20,00')
ON DUPLICATE KEY UPDATE name=name;

-- Obter IDs dos hábitos
SET @agua_id = (SELECT id FROM habits WHERE user_id = @marina_id AND name = 'Beber água');
SET @exercicio_id = (SELECT id FROM habits WHERE user_id = @marina_id AND name = 'Exercícios');
SET @leitura_id = (SELECT id FROM habits WHERE user_id = @marina_id AND name = 'Leitura');
SET @meditacao_id = (SELECT id FROM habits WHERE user_id = @marina_id AND name = 'Meditação');
SET @sono_id = (SELECT id FROM habits WHERE user_id = @marina_id AND name = 'Dormir cedo');
SET @economia_id = (SELECT id FROM habits WHERE user_id = @marina_id AND name = 'Economizar');

-- Inserir conclusões dos últimos 7 dias (simulando dados)
-- Para Beber água (todos os dias)
INSERT INTO habit_completions (habit_id, completion_date) VALUES
(@agua_id, CURDATE()),
(@agua_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(@agua_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(@agua_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(@agua_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(@agua_id, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(@agua_id, DATE_SUB(CURDATE(), INTERVAL 6 DAY))
ON DUPLICATE KEY UPDATE completion_date=completion_date;

-- Para Exercícios (5 dos últimos 7 dias)
INSERT INTO habit_completions (habit_id, completion_date) VALUES
(@exercicio_id, CURDATE()),
(@exercicio_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(@exercicio_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(@exercicio_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(@exercicio_id, DATE_SUB(CURDATE(), INTERVAL 6 DAY))
ON DUPLICATE KEY UPDATE completion_date=completion_date;

-- Para Leitura (4 dos últimos 7 dias)
INSERT INTO habit_completions (habit_id, completion_date) VALUES
(@leitura_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(@leitura_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(@leitura_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(@leitura_id, DATE_SUB(CURDATE(), INTERVAL 6 DAY))
ON DUPLICATE KEY UPDATE completion_date=completion_date;

-- Para Dormir cedo (todos os dias)
INSERT INTO habit_completions (habit_id, completion_date) VALUES
(@sono_id, CURDATE()),
(@sono_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(@sono_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(@sono_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(@sono_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(@sono_id, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(@sono_id, DATE_SUB(CURDATE(), INTERVAL 6 DAY))
ON DUPLICATE KEY UPDATE completion_date=completion_date;

