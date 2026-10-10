import dotenv from 'dotenv';
import pg, { Pool } from 'pg';

// CONFIGURANDO O BANCO
pg.types.setTypeParser(1082, (valor) => valor); // Esta linha faz com que o node-postgres não
                                                // converta o tipo DATE de algum campo de uma
                                                // tabela do banco eu um objeto Date do Javascript
                                                // Isso impede que ele mostre a data no formato ISO
                                                // como em: "2026-10-13T03:00:00.000Z" e faz a data
                                                // ser exibida conforme o banco, no caso o DATE: "2026-10-13"
dotenv.config();
const db = new Pool({
  connectionString: process.env.DATABASE_URL
});

// TESTANDO CONEXÃO
db.query('SELECT NOW()')
  .then((result) => {
    console.log('Banco Conectado!');
    console.log(result.rows);
  })
  .catch((error) => {
    console.error("Não foi possivel conectar-se ao Banco");
    console.error(error);
  })

export default db;