CREATE TABLE turma(
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    nome_turma VARCHAR (100) NOT NULL,
    horario_turma TIME NOT NULL
);

CREATE TABLE alunos(
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    nome_aluno VARCHAR (100) NOT NULL,
    nota_final FLOAT DEFAULT NULL,
    status VARCHAR (20) NOT NULL,
    id_turma INT, 
    CONSTRAINT fk_alunos_turma FOREIGN KEY (id_turma) REFERENCES turma(id_turma)
);

CREATE TABLE professor(
    id_professor INT AUTO_INCREMENT PRIMARY KEY,
    nome_professor VARCHAR (100) NOT NULL,
    materia VARCHAR (100) NOT NULL,
    id_turma INT,
    CONSTRAINT fk_professores_turma FOREIGN KEY (id_turma) REFERENCES turma(id_turma)
);

-- Criando 3 turmas (Atende o mínimo de 2)
INSERT INTO turma (nome_turma, horario_turma) VALUES
('Desenvolvimento Full Stack', '19:00:00'),     -- ID 1
('Arquitetura Full Cycle', '21:00:00'),          -- ID 2
('Programação Orientada a Objetos', '08:00:00'); -- ID 3

-- Criando 3 professores (Atende o mínimo de 3)
INSERT INTO professor (nome_professor, materia, id_turma) VALUES
('Linus Torvalds', 'DevOps e Web', 1),          -- Professor da Turma 1
('Dr. Alan Turing', 'Arquitetura Escalável', 2), -- Professor da Turma 2
('Profa. Grace Hopper', 'Lógica e POO', 3);     -- Professor da Turma 3

-- Criando 6 alunos (Atende o mínimo de 5 e prepara cenários para testar o Back-end)
INSERT INTO alunos (nome_aluno, nota_final, status, id_turma) VALUES
-- Turma 1 (Linus Torvalds)
('Alice Silva', NULL, 'Pendente', 1),    -- Cenário: Aluno recém-matriculado sem nota
('Bruno Souza', 8.5, 'Aprovado', 1),

-- Turma 2 (Alan Turing)
('Carlos Oliveira', 6.8, 'Pendente', 2), -- Cenário: Nota < 7. Bom para testar o bloqueio de alteração para 'Aprovado'
('Diana Prince', 9.5, 'Aprovado', 2),

-- Turma 3 (Grace Hopper)
('Eduardo Santos', 4.0, 'Reprovado', 3),
('Fernanda Lima', 7.2, 'Pendente', 3); 