import { AsyncLocalStorage } from "async_hooks";
export interface RequestContext {
    usuario: string;
    ip?: string;
    workspaceId?: string;
}
export declare const requestContext: AsyncLocalStorage<RequestContext>;
//# sourceMappingURL=requestContext.d.ts.map