import db from "../database/db.js";
import { z } from "zod";

import criarErro from "../utils/criarErro.js";

export const listarTodasTarefas = async (req, res, next) => {
  const idUsuario = req.usuario.id;

  try {
    const resultado = await db.query(
      "SELECT * FROM tarefas WHERE id_usuario = $1",
      [idUsuario],
    );

    res.json(resultado.rows);
  } catch (error) {
    return next(criarErro("Erro ao listar tarefas", 500));
  }
};

export const listarTarefa = async (req, res, next) => {
  const idUsuario = req.usuario.id;
  const idTarefa = req.params.id;

  try {
    const resultado = await db.query(
      "SELECT * FROM tarefas WHERE id = $1 AND id_usuario = $2",
      [idTarefa, idUsuario],
    );

    if (!resultado.rows.length) {
      return next(criarErro("Tarefa não encontrada", 404));
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    return next(criarErro("Erro ao listar tarefa", 500));
  }
};

export const criarTarefa = async (req, res, next) => {
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
  try {
    const resultado = await db.query(
      "INSERT INTO tarefas (titulo, descricao, data_conclusao, id_usuario) VALUES ($1, $2, $3, $4) RETURNING *",
      [dados.titulo, dados.descricao, dados.dataConclusao, id],
    );
    
    res.status(201).json({ 'message': 'Tarefa criada com sucesso', 'tarefa': resultado.rows[0] });
  } catch (error) {
    return next(criarErro('Erro ao criar tarefa', 500));
  }
};

export const editarTarefa = async (req, res, next) => {
  const idUsuario = req.usuario.id;
  const idTarefa = req.params.id;

  // VALIDAÇÃO
  const tarefaSchema = z.object({
    titulo: z.string().min(1, { message: "Digite um título" }),
    descricao: z.string(),
    dataConclusao: z.iso.date(),
    concluida: z.boolean(),
  });

  const result = tarefaSchema.safeParse(req.body);

  if (!result.success) {
    return next(
      criarErro(result.error.issues[0].message || "Insira dados válidos", 400),
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
    if (consultarDB.rows.length === 0) {
      return next(criarErro("Tarefa não encontrada", 404));
    }

    res.status(200).json({ message: "Tarefa atualizada com sucesso", tarefa: consultarDB.rows[0] });
  } catch (error) {
    return next(
      criarErro("Erro ao atualizar tarefa", 500)
    );
  };  
};

export const editarTarefaPATCH = async (req, res, next) => {
  
  // VALIDAÇÃO
  const tarefaSchema = z.object({
    titulo: z.string().min(1).optional(),
    descricao: z.string().optional(),
    dataConclusao: z.iso.date().optional(),
    concluida: z.boolean().optional(),
  });
  
  const result = tarefaSchema.safeParse(req.body);
  
  if (!result.success) {
    return next(criarErro(result.error.issues[0].message || "Dados Inválidos", 400));
  }

  if (Object.entries(result.data).length === 0) {
    return next(criarErro('Insira pelo menos uma informação', 400));
  };
  
  const dados = result.data;
  
  // PREPARANDO SQL
  const COLUNAS = {
    titulo: 'titulo',
    descricao: 'descricao',
    dataConclusao: 'data_conclusao',
    concluida: 'concluida'
  }

  const valores = [];
  const camposSQL = [];

  for (const [campoJS, campoSQL] of Object.entries(COLUNAS)) {
    if (campoJS in dados) {
      valores.push(dados[campoJS]);
      camposSQL.push(`${campoSQL} = $${valores.length}`);
    };
  };

  valores.push(req.params.id);
  valores.push(req.usuario.id);

  const sql = `UPDATE tarefas SET ${camposSQL.join(', ')} WHERE id = $${valores.length - 1} AND id_usuario = $${valores.length} RETURNING *`;

  try {
    const resultado = await db.query(sql, valores);

  if (resultado.rows.length === 0) {
    return next(criarErro('Tarefa não encontrada', 404));
  }

  res.status(200).json({message: 'Tarefa atualizada com sucesso', tarefa: resultado.rows[0]});
  } catch(error) {
    return next(criarErro('Erro ao atualizar tarefa', 500));
  };
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
      return next(criarErro("Tarefa não encontrada", 404));
    }
  } catch (error) {
    return next(criarErro("Erro ao excluir tarefa", 500));
  }

  res.status(204).send();
};