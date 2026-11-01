// import Router from "express";
import db from "../database/db.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import criarErro from "../utils/criarErro.js";

// CADASTRAR (SIGNUP)
export const cadastrarUsuario = async (req, res, next) => {
  const cadastroSchema = z.object({
    nome: z.string().min(1, { message: "Nome obrigatório" }),
    email: z
      .string()
      .email({ message: "Digite um email válido" })
      .toLowerCase(),
    senha: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
  });

  // VALIDANDO O INPUT
  const result = cadastroSchema.safeParse(req.body);

  // res.json({
  //   "Data": result.data,
  //   "Error": result.error,
  //   "Success": result.success
  // })

  if (!result.success) {
    return next(criarErro(result.error.issues[0].message || 'Dados inválidos', 400));
  }

  const dados = result.data;

  // VALIDANDO SE EMAIL JÁ EXISTE
  const userDB = await db.query("SELECT email FROM usuarios WHERE email = $1", [
    dados.email,
  ]);

  if (userDB.rows.length) {
    // se não houver um usuário com determinado email no banco,
    // o array rows de userDB é vazio, logo length = 0
    return next(criarErro('Um usuário com esse email já existe', 400));
  }

  // ENCRIPTANDO A SENHA
  const senhaEncriptada = await bcrypt.hash(dados.senha, 10);

  // SALVANDO NO BANCO DE DADOS
  try {
    const resultado = await db.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [dados.nome, dados.email, senhaEncriptada],
    );

    const user = {
      nome: resultado.rows[0].nome,
      email: resultado.rows[0].email
    };

    res.status(201).json({ message: 'Usuário criado com sucesso', usuario:  user});    
  } catch (error) {
    return next(criarErro('Erro ao criar usuário', 500));
  }

};

// LOGIN
export const logarUsuario = async (req, res, next) => {
  // VALIDANDO INPUT
  const loginSchema = z.object({
    email: z
      .string()
      .email({ message: 'Digite um email válido' })
      .toLowerCase(),
    senha: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
  });

  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    // const erro = new Error(result.error.issues[0].message || 'Dados Inválidos')
    // erro.status = 400;
    // return next(erro);
    return next(
      criarErro(result.error.issues[0].message || 'Dados inválidos', 400),
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
    if (userDB.rows.length === 0) {
      return next(criarErro('Credenciais inválidas', 400));
    }

  } catch (error) {
    return next(criarErro());
  }


  // VERIFICANDO SENHA
  const isMatch = await bcrypt.compare(dados.senha, userDB.rows[0].senha);

  if (!isMatch) {
    return next(criarErro('Credenciais inválidas', 400));
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

  res.status(200).json({ message: 'Login bem sucedido'});
};