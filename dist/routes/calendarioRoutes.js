"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calendarioController_1 = require("../controllers/calendarioController");
const router = (0, express_1.Router)();
router.get("/", calendarioController_1.listarEventos);
router.get("/tribunais", calendarioController_1.listarTribunais);
router.post("/", calendarioController_1.criarEvento);
router.put("/:id", calendarioController_1.atualizarEvento);
router.delete("/:id", calendarioController_1.excluirEvento);
exports.default = router;
//# sourceMappingURL=calendarioRoutes.js.map