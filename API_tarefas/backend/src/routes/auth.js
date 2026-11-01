import Router from "express";
import { cadastrarUsuario, logarUsuario } from '../controllers/authController.js';

const router = Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags: [Autenticação]
 *     summary: Cadastra um usuário
 *     description: O email deve ser único e a senha deve ter pelo menos 8 caracteres.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CadastroUsuario'
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário criado com sucesso
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       '400':
 *         description: Dados inválidos ou email já cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             examples:
 *               emailJaCadastrado:
 *                 summary: Email já cadastrado
 *                 value:
 *                   erro: Um usuário com esse email já existe
 *               dadosInvalidos:
 *                 summary: Dados de cadastro inválidos
 *                 value:
 *                   erro: Digite um email válido
 *       '500':
 *         description: Erro interno ao criar o usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Erro ao criar usuário
 */
router.post('/signup', cadastrarUsuario);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Autentica um usuário
 *     description: Em caso de sucesso, define o cookie HTTP-only `token` com validade de 1 hora.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credenciais'
 *     responses:
 *       '200':
 *         description: Login realizado; cookie de autenticação definido.
 *         headers:
 *           Set-Cookie:
 *             description: Cookie HTTP-only contendo o token JWT.
 *             schema:
 *               type: string
 *               example: token=<jwt>; HttpOnly; SameSite=Strict; Max-Age=3600
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login bem sucedido
 *       '400':
 *         description: Dados inválidos ou credenciais incorretas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             examples:
 *               credenciaisInvalidas:
 *                 summary: Credenciais incorretas
 *                 value:
 *                   erro: Credenciais inválidas
 *               dadosInvalidos:
 *                 summary: Dados de login inválidos
 *                 value:
 *                   erro: Digite um email válido
 *       '500':
 *         description: Erro interno ao autenticar.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               erro: Erro Interno do Servidor
 */
router.post("/login", logarUsuario);

export default router;