import express from 'express'
import { conectarBanco, dbConnection } from './dbConfig.js'
import { status } from './status.js';


const app = express()
await conectarBanco();

const buscarAlunoETurma = async (idAluno, idTurma) => {

  const [alunosEncontrados] = await dbConnection.query('SELECT id_aluno, id_turma FROM alunos WHERE id_aluno = ?', [idAluno]);
  const aluno = alunosEncontrados[0];

  const [turmasEncontradas] = await dbConnection.query('SELECT id_turma FROM turma WHERE id_turma = ?', [idTurma]);
  const turma = turmasEncontradas[0];
  if (!aluno) {
    throw new Error("ALUNO_NAO_ENCONTRADO");
  }
  if (!turma) {
    throw new Error("TURMA_NAO_ENCONTRADA");
  }
  return { aluno, turma };
};

const verificarAlunoEProfessorTurma = async (id_aluno, id_turma, id_professor) => {
  const [aluno] = await dbConnection.query(
    "SELECT id_aluno FROM alunos WHERE id_aluno = ? AND id_turma = ?",
    [id_aluno, id_turma]
  );
  if (aluno.length === 0) {
    throw { status: 404, message: "O aluno não faz parte desta turma." };
  }

  const [turma] = await dbConnection.query(
    "SELECT id_turma FROM turmas WHERE id_turma = ? AND id_professor = ?",
    [id_turma, id_professor]
  );
  if (turma.length === 0) {
    throw { status: 403, message: "O professor não ministra aulas nesta turma." };
  }

  return true;
};


app.post("/matricular/:id_aluno/:id_turma", async (req, res) => {
  try {
    const { id_aluno, id_turma } = req.params;

    await buscarAlunoETurma(id_aluno, id_turma);

    await dbConnection.query('UPDATE alunos SET id_turma = ? WHERE id_aluno = ?', [id_turma, id_aluno]);

    res.json({ idTurma: "Aluno Adicionado a turma" })
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
})


app.patch("/alterar-nota/:id_professor/:id_aluno/:id_turma", async (req, res) => {
  try {
    const { id_aluno, id_professor, id_turma } = req.params;
    const { nota_final } = req.body;

    await buscarAlunoETurma(id_aluno, id_turma);
    if (!id_professor) {
      return res.status(404).json({ message: "Professor não existe logo não pode alterar nota" })
    }
    await verificarAlunoEProfessorTurma(id_aluno, id_turma, id_professor);
    await dbConnection.query('UPDATE alunos SET nota_final = ? WHERE id_aluno = ?', [nota_final, id_aluno]);

    res.json({ notaFinal: "Nota atualizada" })
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ message: e.message });
    }

    console.error(e);
    res.status(500).json({ message: "Erro interno do servidor" })
  }
})

app.patch("/alterar-status/:id_professor/:id_aluno/:id_turma", async (req, res) => {
  try {
    const { id_professor, id_aluno, id_turma, status } = req.params;


    const [buscarNotaNoBanco] = await dbConnection.query('SELECT nota_final FROM alunos WHERE nota_final = ?', [nota_final])
    const notafinalDoAluno = buscarNotaNoBanco[0]

    await buscarAlunoETurma(id_aluno, id_turma);
    if (!id_professor == null) {
      return res.status(404).json({ message: "Professor não existe logo não pode alterar status" })
    }
    await verificarAlunoEProfessorTurma(id_aluno, id_turma, id_professor)

    if (!notafinalDoAluno) {
      return res.status(404).json({ message: "Aluno sem nota, não é possivel mudar o status" });
    }
    if (notafinalDoAluno >= 7 && notafinalDoAluno <= 10) {
      await dbConnection.query('UPDATE alunos SET status = ? WHERE id_aluno = ?', [status, id_aluno]);
    }
    res.json({ notaFinal: "Status atualizado" })
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
})

const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Server rodando em http://localhost:${PORTA}`);
})
