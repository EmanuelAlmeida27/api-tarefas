import db from '../database/db.js';
import { z } from 'zod';
import JWT from 'jsonwebtoken';


import criarErro from '../utils/criarErro.js';

export const listarTodasTarefas = async (req, res) => {
  const resultado = await db.query('SELECT * FROM tarefas');
  res.json(resultado.rows);
};

export const listarTarefa = (req, res) => {

};

export const criarTarefa = async (req, res, next) => {
  const agora = new Date();

  try {
    // VALIDAÇÃO
    const tarefaSchema = z.object({
      titulo: z.string().min(1, { message: "Digite um título" }),
      descricao: z.string().optional(),
      dataConclusao: z.coerce
        .date()
        .min(agora, { message: "Insira uma data válida" })
        .optional(),
    });

    const result = tarefaSchema.safeParse(req.body);
    if (!result.success) {
      return next(
        criarErro(result.error.issues[0].message || "Dados Inválidos", 400),
      );
    }

    const dados = result.data;

    // PEGANDO ID DO USUÁRIO
    const id = req.usuario.id;

    // ARMAZENANDO NO BANCO
    await db.query(
      'INSERT INTO tarefas (titulo, descricao, data_conclusao, id_usuario) VALUES ($1, $2, $3, $4) RETURNING *',
      [dados.titulo, dados.descricao, dados.dataConclusao, id]
    )
  } catch (error) {
    return next(criarErro("Erro ao criar tarefa --- " + error.message, 500));
  }
  
  res.status(201).json({message: "Tarefa criada com sucesso"});

};


export const editarTarefa = (req, res) => {

};

export const excluirTarefa = (req, res) => {

};