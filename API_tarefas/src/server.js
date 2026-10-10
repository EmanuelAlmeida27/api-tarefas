import express from 'express'
import errorHandler from './middleware/erros.js';
import cookieParser from 'cookie-parser';

// IMPORTANDO AS ROTAS
import auth from './routes/auth.js';
import tasks from './routes/tasks.js';

const app = express();
const PORT = 3000;

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

// ROTAS
app.use('/auth', auth);
app.use('/tarefas', tasks);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));