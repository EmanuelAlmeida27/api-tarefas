import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Tarefas",
      version: "1.0.0",
      description: "API para cadastro de usuários e gerenciamento de tarefas.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    tags: [
      { name: "Autenticação", description: "Cadastro e login de usuários" },
      { name: "Tarefas", description: "Gerenciamento das tarefas do usuário autenticado" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "Cookie HTTP-only criado pelo endpoint de login.",
        },
      },
      schemas: {
        Erro: {
          type: "object",
          properties: {
            erro: { type: "string" },
          },
          required: ["erro"],
        },
        Usuario: {
          type: "object",
          properties: {
            nome: { type: "string", example: "Ana Silva" },
            email: { type: "string", format: "email", example: "ana@example.com" },
          },
          required: ["nome", "email"],
        },
        CadastroUsuario: {
          type: "object",
          properties: {
            nome: { type: "string", minLength: 1, example: "Ana Silva" },
            email: { type: "string", format: "email", example: "ana@example.com" },
            senha: { type: "string", minLength: 8, example: "senha123" },
          },
          required: ["nome", "email", "senha"],
        },
        Credenciais: {
          type: "object",
          properties: {
            email: { type: "string", format: "email", example: "ana@example.com" },
            senha: { type: "string", minLength: 8, example: "senha123" },
          },
          required: ["email", "senha"],
        },
        Tarefa: {
          type: "object",
          properties: {
            id: { type: "string", example: "1" },
            titulo: { type: "string", example: "Estudar Swagger" },
            descricao: { type: "string", nullable: true, example: "Documentar os endpoints" },
            data_conclusao: { type: "string", format: "date", nullable: true, example: "2026-10-30" },
            concluida: { type: "boolean", example: false },
            id_usuario: { type: "string", example: "1" },
          },
          required: ["id", "titulo", "descricao", "data_conclusao", "concluida", "id_usuario"],
        },
        NovaTarefa: {
          type: "object",
          properties: {
            titulo: { type: "string", minLength: 1, example: "Estudar Swagger" },
            descricao: { type: "string", example: "Documentar os endpoints" },
            dataConclusao: { type: "string", format: "date", example: "2026-10-30" },
          },
          required: ["titulo"],
        },
        AtualizacaoTarefa: {
          type: "object",
          properties: {
            titulo: { type: "string", minLength: 1, example: "Estudar Swagger" },
            descricao: { type: "string", example: "Documentar os endpoints" },
            dataConclusao: { type: "string", format: "date", example: "2026-10-30" },
            concluida: { type: "boolean", example: false },
          },
          required: ["titulo", "descricao", "dataConclusao", "concluida"],
        },
        AtualizacaoParcialTarefa: {
          type: "object",
          minProperties: 1,
          properties: {
            titulo: { type: "string", minLength: 1, example: "Estudar Swagger" },
            descricao: { type: "string", example: "Documentar os endpoints" },
            dataConclusao: { type: "string", format: "date", example: "2026-10-30" },
            concluida: { type: "boolean", example: true },
          },
        },
        ResultadoTarefa: {
          type: "object",
          properties: {
            message: { type: "string", example: "Tarefa criada com sucesso" },
            tarefa: { $ref: "#/components/schemas/Tarefa" },
          },
          required: ["message", "tarefa"],
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
