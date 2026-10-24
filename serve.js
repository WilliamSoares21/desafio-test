import express from 'express'
import {dbConnection} from './dbConnection.js'

const app = express()

const verificaAlunoEMatricula = async (idAluno, idTurma = null) => {

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


app.post("/matricular/:id-aluno/:id-turma", async (req, res) =>{
    try{
        const {idAluno} = req.params;
        const {idTurma} = req.params;

        verificaAlunoEMatricula(idAluno, idTurma);
        await dbConnection.query('UPDATE alunos SET id_turma = ? WHERE id_turma', [idTurma]);

        res.json({ idTurma: "Aluno Adicionado a turma" })
    }catch(e){
        console.log(e);
        res.status(500).json({ error: "Erro interno no servidor" });   
    }
})


app.patch("/alterar-nota/:id-aluno", async (req, res) =>{
    try{
        const {idAluno} = req.params;
        const {notaFinal} = req.params;

        const [buscarNotaNoBanco] = await dbConnection.query('SELECT nota_final FROM alunos WHERE nota_final = ?', [notaFinal])
        
        verificaAlunoEMatricula(idAluno);

        await dbConnection.query('UPDATE alunos SET nota_final = ? WHERE nota_final', [notaFinal]);

        res.json({ notaFinal: "Nota atualizada" })
    }catch(e){
        console.log(e);
        res.status(500).json({ error: "Erro interno no servidor" });   
    }
})

app.patch("/alterar-status/:id-professor/:id-aluno/:id-turma", async (req, res) =>{
    try{
        const {idAluno} = req.params;
        const {idProfessor} = req.params;
        const {notaFinal} = req.params;
        const {status} = req.params;

        const [buscarNotaNoBanco] = await dbConnection.query('SELECT nota_final FROM alunos WHERE nota_final = ?', [notaFinal])
        const notafinalDoAluno = buscarNotaNoBanco[0]
        
        verificaAlunoEMatricula(idAluno, idTurma);
        if(!notafinalDoAluno){
           return res.status(404).json({ message: "Aluno sem nota, não é possivel mudar o status" });
        }
        if(!idTurma == idAluno){
            return res.status(404).json({ message: "Aluno não pertence a essa turma" });
        }
        if(notafinalDoAluno >= 7 && notafinalDoAluno <= 10){
            await dbConnection.query('UPDATE alunos SET status = ? WHERE status', [status]);
        }
        res.json({ notaFinal: "Status atualizado" })
    }catch(e){
        console.log(e);
        res.status(500).json({ error: "Erro interno no servidor" });   
    }
})

const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Server rodando em http://localhost:${PORTA}`);
})