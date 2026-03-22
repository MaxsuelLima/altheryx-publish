"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const escritorioController_1 = require("../controllers/escritorioController");
const router = (0, express_1.Router)();
router.get("/", escritorioController_1.listarEscritorios);
router.get("/:id", escritorioController_1.buscarEscritorio);
router.post("/", escritorioController_1.criarEscritorio);
router.put("/:id", escritorioController_1.atualizarEscritorio);
router.delete("/:id", escritorioController_1.excluirEscritorio);
exports.default = router;
//# sourceMappingURL=escritorioRoutes.js.map