import db from "../database/db.js";
import { z } from "zod";

import criarErro from "../utils/criarErro.js";

export const listarTodasTarefas = async (req, res, next) => {
  const idUsuario = req.usuario.id;

  try {
    const resultado = await db.query("SELECT * FROM tarefas WHERE id_usuario = $1", [idUsuario]);
    res.json(resultado.rows);
  } catch (error) {
    return next(criarErro('Erro ao listar tarefas', 500));
  }
};

export const listarTarefa = async (req, res, next) => {
  const idUsuario = req.usuario.id;
  const idTarefa = req.params.id;

  try {
    const resultado = await db.query(
      'SELECT * FROM tarefas WHERE id = $1 AND id_usuario = $2',
      [idTarefa, idUsuario]
    );

    if (!resultado.rows.length) {
      return next(criarErro('Tarefa não encontrada', 400));
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    return next(criarErro('Erro ao listar tarefa', 500));
  }
};

export const criarTarefa = async (req, res, next) => {
  try {
    // VALIDAÇÃO
    const tarefaSchema = z.object({
      titulo: z.string().min(1, { message: "Digite um título" }),
      descricao: z.string().optional(),
      dataConclusao: z.iso.date().optional(),
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
      "INSERT INTO tarefas (titulo, descricao, data_conclusao, id_usuario) VALUES ($1, $2, $3, $4) RETURNING *",
      [dados.titulo, dados.descricao, dados.dataConclusao, id],
    );
  } catch (error) {
    return next(criarErro("Erro ao criar tarefa --- " + error.message, 500));
  }

  res.status(201).json({ message: "Tarefa criada com sucesso" });
};

export const editarTarefa = async (req, res, next) => {
  const idUsuario = req.usuario.id;
  const idTarefa = req.params.id;

  // VALIDAÇÃO
  const tarefaSchema = z.object({
    titulo: z.string().min(1, { message: "Digite um título" }),
    descricao: z.string().optional(),
    dataConclusao: z.iso.date().optional(),
    concluida: z.boolean(),
  });

  const result = tarefaSchema.safeParse(req.body);

  if (!result.success) {
    return next(
      criarErro(result.issues[0].message || "Insira dados válidos", 400),
    );
  }

  const dados = result.data;

  // ATUALIZANDO TAREFA
  try {
    const consultarDB = await db.query(
      "UPDATE tarefas SET titulo = $1, descricao = $2, data_conclusao = $3, concluida = $4 WHERE id = $5 AND id_usuario = $6 RETURNING *",
      [
        dados.titulo,
        dados.descricao,
        dados.dataConclusao,
        dados.concluida,
        idTarefa,
        idUsuario,
      ],
    );

    // VE SE TAREFA EXISTE NO BANCO
    if (!consultarDB.rows.length) {
      return next(criarErro("Tarefa não encontrada", 400));
    }
  } catch (error) {
    return next(
      criarErro("Erro ao atualizar tarefa --- " + error.message, 500),
    );
  }

  res.status(200).json({ message: "Tarefa atualizada com sucesso" });
};

export const excluirTarefa = async (req, res, next) => {
  const idUsuario = req.usuario.id;
  const idTarefa = req.params.id;

  try {
    const resultado = await db.query(
      "DELETE FROM tarefas WHERE id = $1 AND id_usuario = $2 RETURNING *",
      [idTarefa, idUsuario],
    );

    if (!resultado.rows.length) {
      return next(criarErro('Tarefa não encontrada', 400));
    }
  } catch (error) {
    return next(criarErro("Erro ao excluir tarefa --- " + error.message, 500));
  }

  res.status(200).json({ message: "Tarefa Excluida com Sucesso" });
};
