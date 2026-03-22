"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const advogadoController_1 = require("../controllers/advogadoController");
const router = (0, express_1.Router)();
router.get("/", advogadoController_1.listarAdvogados);
router.get("/:id", advogadoController_1.buscarAdvogado);
router.post("/", advogadoController_1.criarAdvogado);
router.put("/:id", advogadoController_1.atualizarAdvogado);
router.delete("/:id", advogadoController_1.excluirAdvogado);
exports.default = router;
//# sourceMappingURL=advogadoRoutes.js.map