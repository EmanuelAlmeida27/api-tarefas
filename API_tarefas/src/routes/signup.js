import Router from 'express';
import db from '../database/db.js';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const router = Router();

// CADASTRO

router.post('/', async (req, res, next) => {
  const cadastroSchema = z.object({
    nome: z.string().min(1, {message: "Nome Obrigatório"}),
    email: z.string().email({message: "Digite Um Email Válido"}).toLowerCase(),
    senha: z.string().min(8, {message: "A Senha Deve Ter No Mínimo 8 Caracteres"})
  });

  // VALIDANDO O INPUT
  const result = cadastroSchema.safeParse(req.body);

  // res.json({
  //   "Data": result.data,
  //   "Error": result.error,
  //   "Success": result.success
  // })

  if (!result.success) {
    const primeiraMensagem =
      result.error.issues[0].message || "Dados inválidos";
    const erro = new Error(primeiraMensagem);
    erro.status = 400;
    return next(erro);
  }

  const dados = result.data;

  // VALIDANDO SE EMAIL JÁ EXISTE
  const userDB = await db.query('SELECT email FROM usuarios WHERE email = $1', [dados.email])

  if (userDB.rows.length) { // se não houver um usuário com determinado email no banco,
                            // o array rows de userDB é vazio, logo length = 0
    const erro = new Error("Um Usuário Com Esse Email Já Existe");
    erro.status = 400;
    return next(erro);
  }

  // ENCRIPTANDO A SENHA
  const senhaEncriptada = await bcrypt.hash(dados.senha, 10);

  // SALVANDO NO BANCO DE DADOS
  try {
    await db.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *', [dados.nome, dados.email, senhaEncriptada]);
  } catch (error) {
    const erro = new Error("Erro Ao Criar Usuário");
    return next(erro);
  }

  res.status(201).json({message: "Usuário Criado Com Sucesso"})
});

export default router;