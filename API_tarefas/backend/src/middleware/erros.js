import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  logger(err, req, status);
  
  if (err.status) {
    res.status(err.status).json({ erro: err.message });
  } else {
    res.status(500).json({ erro: "Erro Interno Do Servidor" });
  }
};

export default errorHandler;
