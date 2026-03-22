"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectRequestContext = injectRequestContext;
const requestContext_1 = require("../lib/requestContext");
function injectRequestContext(req, _res, next) {
    const forwarded = req.headers["x-forwarded-for"];
    let ip;
    if (forwarded) {
        ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(",")[0].trim();
    }
    else {
        ip = req.socket?.remoteAddress || undefined;
    }
    const ctx = {
        usuario: req.user?.userName || "sistema",
        ip,
        workspaceId: req.workspaceId || req.user?.workspaceId || undefined,
    };
    requestContext_1.requestContext.run(ctx, next);
}
//# sourceMappingURL=requestContextMiddleware.js.map