"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateToken = generateToken;
exports.generateMasterToken = generateMasterToken;
exports.verifyToken = verifyToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "altheryx-secret-key-change-me";
const JWT_EXPIRES_IN = "24h";
async function hashPassword(plain) {
    return bcryptjs_1.default.hash(plain, 10);
}
async function comparePassword(plain, hash) {
    return bcryptjs_1.default.compare(plain, hash);
}
function generateToken(payload) {
    return jsonwebtoken_1.default.sign({ ...payload, isMaster: false }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function generateMasterToken() {
    const payload = {
        userId: "master",
        userName: "Master Admin",
        workspaceId: "",
        workspaceSlug: "",
        role: "MASTER_ADMIN",
        isAdmin: true,
        isMaster: true,
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
//# sourceMappingURL=auth.js.map