"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const routes_1 = __importDefault(require("./routes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const requestContextMiddleware_1 = require("./middleware/requestContextMiddleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/auth", authRoutes_1.default);
app.use("/admin", authMiddleware_1.authenticate, authMiddleware_1.requireMaster, requestContextMiddleware_1.injectRequestContext, adminRoutes_1.default);
app.use(authMiddleware_1.authenticate, authMiddleware_1.injectWorkspace, requestContextMiddleware_1.injectRequestContext, routes_1.default);
const publicPath = path_1.default.join(__dirname, "..", "public");
if (fs_1.default.existsSync(publicPath)) {
    app.use(express_1.default.static(publicPath));
    app.get("*", (_req, res) => {
        res.sendFile(path_1.default.join(publicPath, "index.html"));
    });
}
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=server.js.map