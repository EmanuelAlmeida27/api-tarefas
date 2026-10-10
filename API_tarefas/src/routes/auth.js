import Router from "express";
import { cadastrarUsuario, logarUsuario } from '../controllers/authController.js';

const router = Router();

// CADASTRO
router.post('/signup', cadastrarUsuario);

// LOGIN
router.post("/login", logarUsuario);

export default router;