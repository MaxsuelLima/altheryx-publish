export declare function hashPassword(plain: string): Promise<string>;
export declare function comparePassword(plain: string, hash: string): Promise<boolean>;
export interface TokenPayload {
    userId: string;
    userName: string;
    workspaceId: string;
    workspaceSlug: string;
    role: string;
    isAdmin: boolean;
    isMaster: boolean;
}
export declare function generateToken(payload: Omit<TokenPayload, "isMaster">): string;
export declare function generateMasterToken(): string;
export declare function verifyToken(token: string): TokenPayload;
//# sourceMappingURL=auth.d.ts.map