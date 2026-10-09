import Router from "express";
import db from "../database/db.js";
import { strictObject, z } from "zod";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import criarErro from "../utils/criarErro.js";

const router = Router();

router.post("/", async (req, res, next) => {
  // VALIDANDO INPUT
  const loginSchema = z.object({
    email: z
      .string()
      .email({ message: "Digite Um Email Válido" })
      .toLowerCase(),
    senha: z
      .string()
      .min(8, { message: "A Senha Deve Ter No Mínimo 8 Caracteres" }),
  });

  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    // const erro = new Error(result.error.issues[0].message || 'Dados Inválidos')
    // erro.status = 400;
    // return next(erro);
    return next(
      criarErro(result.error.issues[0].message || "Dados Inválidos", 400),
    );
  }

  const dados = result.data;

  // VERIFICANDO SE EMAIL EXISTE NO BANCO
  let userDB;
  try {
    userDB = await db.query(
      "SELECT id, email, senha FROM usuarios WHERE email = $1",
      [dados.email],
    );
  } catch (error) {
    // const erro = new Error();
    // return next(erro);
    return next(criarErro());
  }

  if (!userDB.rows.length) {
    return next(criarErro("Credenciais Inválidas", 400));
  }

  // VERIFICANDO SENHA
  const isMatch = await bcrypt.compare(dados.senha, userDB.rows[0].senha);

  if (!isMatch) {
    return next(criarErro("Credenciais Inválidas", 400));
  }

  // CRIANDO TOKEN
  const token = await JWT.sign(
    {id: userDB.rows[0].id}, 
    process.env.JWT_SECRET,
    {expiresIn: '1h'}
  );

  // ARMAZENADO COOKIE
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000
  });

  res.status(200).json({message: 'Login Bem Sucedido'});

});

export default router;
