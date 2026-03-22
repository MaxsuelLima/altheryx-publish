"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/login", authController_1.login);
router.post("/master-login", authController_1.masterLogin);
router.get("/me", authMiddleware_1.authenticate, authController_1.me);
router.get("/workspace/:slug", authController_1.getWorkspaceInfo);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map