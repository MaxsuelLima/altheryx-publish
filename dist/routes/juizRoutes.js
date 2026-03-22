"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const juizController_1 = require("../controllers/juizController");
const router = (0, express_1.Router)();
router.get("/", juizController_1.listarJuizes);
router.get("/:id", juizController_1.buscarJuiz);
router.post("/", juizController_1.criarJuiz);
router.put("/:id", juizController_1.atualizarJuiz);
router.delete("/:id", juizController_1.excluirJuiz);
exports.default = router;
//# sourceMappingURL=juizRoutes.js.map