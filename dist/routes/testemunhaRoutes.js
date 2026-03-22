"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testemunhaController_1 = require("../controllers/testemunhaController");
const router = (0, express_1.Router)();
router.get("/", testemunhaController_1.listarTestemunhas);
router.get("/:id", testemunhaController_1.buscarTestemunha);
router.post("/", testemunhaController_1.criarTestemunha);
router.put("/:id", testemunhaController_1.atualizarTestemunha);
router.delete("/:id", testemunhaController_1.excluirTestemunha);
exports.default = router;
//# sourceMappingURL=testemunhaRoutes.js.map