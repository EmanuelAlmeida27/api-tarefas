import { appendFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url); // endereço do arquivo atual
const __dirname = path.dirname(__filename); // diretorio do arquivo atual

const CAMINHO_LOG = path.resolve(__dirname, "../../logs/app.log");
const PASTA_LOG = path.dirname(CAMINHO_LOG);

const logger = (erro, req, status) => {
  const dataAtual = new Date();
  const mensagemLog = `----------------------------------------- New Error -----------------------------------------\n[${dataAtual.toISOString()}] | ${status} | ${req.method} | ${req.originalUrl}\n${erro.stack}\n---------------------------------------------------------------------------------------------\n\n`;

  mkdirSync(PASTA_LOG, { recursive: true });
  appendFileSync(CAMINHO_LOG, mensagemLog);
};

export default logger;
