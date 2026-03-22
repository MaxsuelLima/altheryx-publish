"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicacaoController_1 = require("../controllers/publicacaoController");
const router = (0, express_1.Router)();
router.get("/", publicacaoController_1.listarPublicacoes);
router.get("/buscar", publicacaoController_1.buscarPorPalavraChave);
router.post("/", publicacaoController_1.criarPublicacao);
router.put("/:id", publicacaoController_1.atualizarPublicacao);
router.patch("/:id/lida", publicacaoController_1.marcarLida);
router.delete("/:id", publicacaoController_1.excluirPublicacao);
exports.default = router;
//# sourceMappingURL=publicacaoRoutes.js.map