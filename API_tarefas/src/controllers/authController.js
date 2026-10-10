// import Router from "express";
import db from "../database/db.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import criarErro from "../utils/criarErro.js";

// CADASTRAR (SIGNUP)
export const cadastrarUsuario = async (req, res, next) => {
  const cadastroSchema = z.object({
    nome: z.string().min(1, { message: "Nome Obrigatório" }),
    email: z
      .string()
      .email({ message: "Digite Um Email Válido" })
      .toLowerCase(),
    senha: z
      .string()
      .min(8, { message: "A Senha Deve Ter No Mínimo 8 Caracteres" }),
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
  const userDB = await db.query("SELECT email FROM usuarios WHERE email = $1", [
    dados.email,
  ]);

  if (userDB.rows.length) {
    // se não houver um usuário com determinado email no banco,
    // o array rows de userDB é vazio, logo length = 0
    const erro = new Error("Um Usuário Com Esse Email Já Existe");
    erro.status = 400;
    return next(erro);
  }

  // ENCRIPTANDO A SENHA
  const senhaEncriptada = await bcrypt.hash(dados.senha, 10);

  // SALVANDO NO BANCO DE DADOS
  try {
    await db.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [dados.nome, dados.email, senhaEncriptada],
    );
  } catch (error) {
    const erro = new Error("Erro Ao Criar Usuário");
    return next(erro);
  }

  res.status(201).json({ message: "Usuário Criado Com Sucesso" });
};

// LOGIN
export const logarUsuario = async (req, res, next) => {
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
    { id: userDB.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  // ARMAZENADO COOKIE
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Login Bem Sucedido" });
};