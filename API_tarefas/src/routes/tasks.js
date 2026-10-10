import Router from 'express';

import {autenticar} from "../middleware/verifyTokenCookie.js";

// IMPORT DAS FUNÇÕES
import {listarTodasTarefas, criarTarefa, excluirTarefa, editarTarefa, listarTarefa} from '../controllers/taskController.js';

const router = Router();

router.get('/', autenticar, listarTodasTarefas);
router.get('/:id', autenticar, listarTarefa);
router.post('/', autenticar, criarTarefa);
router.put('/:id', autenticar, editarTarefa);
router.delete('/:id', autenticar, excluirTarefa);

export default router;