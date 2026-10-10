import Router from 'express';

import {autenticar} from "../middleware/verifyTokenCookie.js";

// IMPORT DAS FUNÇÕES
import {listarTodasTarefas, criarTarefa} from '../controllers/taskController.js';

const router = Router();

router.get('/', listarTodasTarefas);
router.post('/', autenticar, criarTarefa);

export default router;