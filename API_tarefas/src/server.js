import express from 'express'
import errorHandler from './middleware/erros.js';

// IMPORTANDO AS ROTAS
import signup from './routes/signup.js';
import login from './routes/login.js';

const app = express();
const PORT = 3000;

// MIDDLEWARE
app.use(express.json());

// ROTAS
app.use('/signup', signup);
app.use('/login', login);


app.use(errorHandler);

app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));