import express from 'express'
import errorHandler from './middleware/erros.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

// IMPORTANDO AS ROTAS
import auth from './routes/auth.js';
import tasks from './routes/tasks.js';

const app = express();
const PORT = 3000;

// MIDDLEWARE
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: ["https://api-tarefas.vercel.app", "http://localhost:5173"],
    credentials: true, // obrigatório para enviar cookies
  }),
);

// ROTAS
app.use('/auth', auth);
app.use('/tarefas', tasks);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));