CREATE TABLE turmas(
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    nome_turma VARCHAR (100) NOT NULL,
    horario_turma TIME NOT NULL
);

CREATE TABLE alunos(
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    nome_aluno VARCHAR(100) NOT NULL,
    nota_final DECIMAL(3, 1) DEFAULT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT check_status_e_nota CHECK (
        status IN ('APROVADO', 'REPROVADO', 'PENDENTE') 
        AND (nota_final IS NULL OR (nota_final >= 0.0 AND nota_final <= 10.0))
    ),
    id_turma INT,
    CONSTRAINT fk_alunos_turma FOREIGN KEY (id_turma) REFERENCES turmas(id_turma)
);

CREATE TABLE professores(
    id_professor INT AUTO_INCREMENT PRIMARY KEY,
    nome_professor VARCHAR (100) NOT NULL,
    materia VARCHAR (100) NOT NULL,
    id_turma INT,
    CONSTRAINT fk_professores_turma FOREIGN KEY (id_turma) REFERENCES turmas(id_turma)
);

-- Criando 3 turmass (Atende o mínimo de 2)
INSERT INTO turmas (nome_turma, horario_turma) VALUES
('Desenvolvimento Full Stack', '19:00:00'),     -- ID 1
('Arquitetura Full Cycle', '21:00:00'),          -- ID 2
('Programação Orientada a Objetos', '08:00:00'); -- ID 3

-- Criando 3 professores (Atende o mínimo de 3)
INSERT INTO professores (nome_professor, materia, id_turma) VALUES
('Linus Torvalds', 'DevOps e Web', 1),          -- Professor da Turma 1
('Dr. Alan Turing', 'Arquitetura Escalável', 2), -- Professor da Turma 2
('Profa. Grace Hopper', 'Lógica e POO', 3);     -- Professor da Turma 3

-- Criando 6 alunos (Atende o mínimo de 5 e prepara cenários para testar o Back-end)
INSERT INTO alunos (nome_aluno, nota_final, status, id_turma) VALUES
-- Turma 1 (Linus Torvalds)
('Alice Silva', NULL, 'PENDENTE', 1),    -- Cenário: Aluno recém-matriculado sem nota
('Bruno Souza', 8.5, 'APROVADO', 1),

-- Turma 2 (Alan Turing)
('Carlos Oliveira', 6.8, 'PENDENTE', 2), -- Cenário: Nota < 7. Bom para testar o bloqueio de alteração para 'APROVADO'
('Diana Prince', 9.5, 'APROVADO', 2),

-- Turma 3 (Grace Hopper)
('Eduardo Santos', 4.0, 'REPROVADO', 3),
('Fernanda Lima', 7.2, 'PENDENTE', 3); 
