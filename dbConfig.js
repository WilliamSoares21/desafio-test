import mysql from 'mysql2/promise';

// objeto de config pura, sem criar o pool 
const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// cria o pool uma unica vez para carregar o modulo
export const dbConnection = mysql.createPool(config);

// essa função apenas valida se o poll consegue conversar com o banco
export async function conectarBanco(tentativas = 5, delay = 3000) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      await dbConnection.query('SELECT 1');

      console.log("Conexao com o Pool do banco realizada com sucesso");
      return dbConnection;
    } catch (error) {
      console.error(`Tentativa ${i}/${tentativas} falhou. Banco ainda não está pronto...`);

      if (i === tentativas) {
        console.error("Não foi possível conectar ao banco de dados. Encerrando API.");
        process.exit(1);
      }

      // Aguarda o tempo do delay antes de tentar a próxima iteração
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

