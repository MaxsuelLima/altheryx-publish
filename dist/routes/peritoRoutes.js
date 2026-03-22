"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const peritoController_1 = require("../controllers/peritoController");
const router = (0, express_1.Router)();
router.get("/", peritoController_1.listarPeritos);
router.get("/:id", peritoController_1.buscarPerito);
router.post("/", peritoController_1.criarPerito);
router.put("/:id", peritoController_1.atualizarPerito);
router.delete("/:id", peritoController_1.excluirPerito);
exports.default = router;
//# sourceMappingURL=peritoRoutes.js.map