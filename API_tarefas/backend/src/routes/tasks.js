import Router from 'express';

import {autenticar} from "../middleware/verifyTokenCookie.js";

// IMPORT DAS FUNÇÕES
import {listarTodasTarefas, criarTarefa, excluirTarefa, editarTarefa, listarTarefa, editarTarefaPATCH} from '../controllers/taskController.js';

const router = Router();

/**
 * @openapi
 * /tarefas:
 *   get:
 *     tags: [Tarefas]
 *     summary: Lista as tarefas do usuário autenticado
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Lista de tarefas do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tarefa'
 *       '401':
 *         description: Cookie ausente ou token inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             examples:
 *               naoAutenticado:
 *                 summary: Cookie de autenticação ausente
 *                 value:
 *                   erro: Não Autenticado
 *               tokenInvalido:
 *                 summary: Token inválido
 *                 value:
 *                   erro: Token Inválido
 *       '500':
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Erro Interno Do Servidor
 */
router.get('/', autenticar, listarTodasTarefas);

/**
 * @openapi
 * /tarefas/{id}:
 *   get:
 *     tags: [Tarefas]
 *     summary: Busca uma tarefa pelo ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa.
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       '200':
 *         description: Tarefa encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       '401':
 *         description: Cookie ausente ou token inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             examples:
 *               naoAutenticado:
 *                 summary: Cookie de autenticação ausente
 *                 value:
 *                   erro: Não Autenticado
 *               tokenInvalido:
 *                 summary: Token inválido
 *                 value:
 *                   erro: Token Inválido
 *       '404':
 *         description: Tarefa não encontrada para este usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Tarefa não encontrada
 *       '500':
 *         description: Erro interno ao buscar tarefa.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Erro ao listar tarefa
 */
router.get('/:id', autenticar, listarTarefa);

/**
 * @openapi
 * /tarefas:
 *   post:
 *     tags: [Tarefas]
 *     summary: Cria uma tarefa
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovaTarefa'
 *     responses:
 *       '201':
 *         description: Tarefa criada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResultadoTarefa'
 *       '400':
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Digite um título
 *       '401':
 *         description: Cookie ausente ou token inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             examples:
 *               naoAutenticado:
 *                 summary: Cookie de autenticação ausente
 *                 value:
 *                   erro: Não Autenticado
 *               tokenInvalido:
 *                 summary: Token inválido
 *                 value:
 *                   erro: Token Inválido
 *       '500':
 *         description: Erro interno ao criar tarefa.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Erro ao criar tarefa
 */
router.post('/', autenticar, criarTarefa);

/**
 * @openapi
 * /tarefas/{id}:
 *   put:
 *     tags: [Tarefas]
 *     summary: Substitui os dados de uma tarefa
 *     description: Todos os campos devem ser informados.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa.
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizacaoTarefa'
 *     responses:
 *       '200':
 *         description: Tarefa atualizada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResultadoTarefa'
 *       '400':
 *         description: Dados inválidos ou incompletos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Insira dados válidos
 *       '401':
 *         description: Cookie ausente ou token inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             examples:
 *               naoAutenticado:
 *                 summary: Cookie de autenticação ausente
 *                 value:
 *                   erro: Não Autenticado
 *               tokenInvalido:
 *                 summary: Token inválido
 *                 value:
 *                   erro: Token Inválido
 *       '404':
 *         description: Tarefa não encontrada para este usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Tarefa não encontrada
 *       '500':
 *         description: Erro interno ao atualizar tarefa.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Erro ao atualizar tarefa
 */
router.put('/:id', autenticar, editarTarefa);

/**
 * @openapi
 * /tarefas/{id}:
 *   patch:
 *     tags: [Tarefas]
 *     summary: Atualiza parcialmente uma tarefa
 *     description: Informe pelo menos um dos campos de atualização.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa.
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizacaoParcialTarefa'
 *     responses:
 *       '200':
 *         description: Tarefa atualizada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResultadoTarefa'
 *       '400':
 *         description: Dados inválidos ou nenhum campo informado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Insira pelo menos uma informação
 *       '401':
 *         description: Cookie ausente ou token inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             examples:
 *               naoAutenticado:
 *                 summary: Cookie de autenticação ausente
 *                 value:
 *                   erro: Não Autenticado
 *               tokenInvalido:
 *                 summary: Token inválido
 *                 value:
 *                   erro: Token Inválido
 *       '404':
 *         description: Tarefa não encontrada para este usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Tarefa não encontrada
 *       '500':
 *         description: Erro interno ao atualizar tarefa.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Erro ao atualizar tarefa
 */
router.patch('/:id', autenticar, editarTarefaPATCH);

/**
 * @openapi
 * /tarefas/{id}:
 *   delete:
 *     tags: [Tarefas]
 *     summary: Exclui uma tarefa
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da tarefa.
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       '204':
 *         description: Tarefa excluída.
 *       '401':
 *         description: Cookie ausente ou token inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             examples:
 *               naoAutenticado:
 *                 summary: Cookie de autenticação ausente
 *                 value:
 *                   erro: Não Autenticado
 *               tokenInvalido:
 *                 summary: Token inválido
 *                 value:
 *                   erro: Token Inválido
 *       '404':
 *         description: Tarefa não encontrada para este usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Tarefa não encontrada
 *       '500':
 *         description: Erro interno ao excluir tarefa.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Erro ao excluir tarefa
 */
router.delete('/:id', autenticar, excluirTarefa);

export default router;