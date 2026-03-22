"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarDocumentos = listarDocumentos;
exports.uploadDocumento = uploadDocumento;
exports.downloadDocumento = downloadDocumento;
exports.visualizarDocumento = visualizarDocumento;
exports.atualizarDocumento = atualizarDocumento;
exports.excluirDocumento = excluirDocumento;
const prisma_1 = require("../lib/prisma");
const upload_1 = require("../lib/upload");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
async function listarDocumentos(req, res) {
    try {
        const origem = req.query.origem;
        const flagDecisao = req.query.flagDecisao;
        const documentos = await prisma_1.prisma.documento.findMany({
            where: {
                workspaceId: req.workspaceId,
                processoId: req.params.id,
                documentoPaiId: null,
                ...(origem && { origem: origem }),
                ...(flagDecisao && { flagDecisao: flagDecisao }),
            },
            include: {
                anexos: {
                    where: { deletadoEm: null },
                    orderBy: { dataDocumento: "asc" },
                },
            },
            orderBy: { dataDocumento: "desc" },
        });
        return res.json(documentos);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar documentos" });
    }
}
async function uploadDocumento(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado" });
        }
        const documento = await prisma_1.prisma.documento.create({
            data: {
                workspaceId: req.workspaceId,
                processoId: req.params.id,
                nomeOriginal: req.file.originalname,
                nomeArquivo: req.file.filename,
                mimeType: req.file.mimetype,
                tamanho: req.file.size,
                origem: req.body.origem || "OUTRO",
                flagDecisao: req.body.flagDecisao || "NENHUMA",
                classificacaoAnexo: req.body.classificacaoAnexo || null,
                documentoPaiId: req.body.documentoPaiId || null,
                descricao: req.body.descricao || null,
                dataDocumento: req.body.dataDocumento
                    ? new Date(req.body.dataDocumento)
                    : new Date(),
            },
        });
        return res.status(201).json(documento);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao fazer upload" });
    }
}
async function downloadDocumento(req, res) {
    try {
        const documento = await prisma_1.prisma.documento.findFirst({
            where: { id: req.params.docId, workspaceId: req.workspaceId },
        });
        if (!documento) {
            return res.status(404).json({ error: "Documento não encontrado" });
        }
        const filePath = path_1.default.join(upload_1.uploadDir, documento.nomeArquivo);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: "Arquivo não encontrado no servidor" });
        }
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(documento.nomeOriginal)}"`);
        res.setHeader("Content-Type", documento.mimeType);
        const stream = fs_1.default.createReadStream(filePath);
        stream.pipe(res);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao baixar documento" });
    }
}
async function visualizarDocumento(req, res) {
    try {
        const documento = await prisma_1.prisma.documento.findFirst({
            where: { id: req.params.docId, workspaceId: req.workspaceId },
        });
        if (!documento) {
            return res.status(404).json({ error: "Documento não encontrado" });
        }
        const filePath = path_1.default.join(upload_1.uploadDir, documento.nomeArquivo);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: "Arquivo não encontrado no servidor" });
        }
        res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(documento.nomeOriginal)}"`);
        res.setHeader("Content-Type", documento.mimeType);
        const stream = fs_1.default.createReadStream(filePath);
        stream.pipe(res);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao visualizar documento" });
    }
}
async function atualizarDocumento(req, res) {
    try {
        const documento = await prisma_1.prisma.documento.update({
            where: { id: req.params.docId },
            data: {
                ...(req.body.origem && { origem: req.body.origem }),
                ...(req.body.flagDecisao && { flagDecisao: req.body.flagDecisao }),
                ...(req.body.classificacaoAnexo !== undefined && { classificacaoAnexo: req.body.classificacaoAnexo || null }),
                ...(req.body.descricao !== undefined && { descricao: req.body.descricao || null }),
                ...(req.body.dataDocumento && { dataDocumento: new Date(req.body.dataDocumento) }),
                ...(req.body.documentoPaiId !== undefined && { documentoPaiId: req.body.documentoPaiId || null }),
            },
        });
        return res.json(documento);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar documento" });
    }
}
async function excluirDocumento(req, res) {
    try {
        const documento = await prisma_1.prisma.documento.findFirst({
            where: { id: req.params.docId, workspaceId: req.workspaceId },
        });
        if (!documento) {
            return res.status(404).json({ error: "Documento não encontrado" });
        }
        await prisma_1.prisma.documento.update({
            where: { id: req.params.docId },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir documento" });
    }
}
//# sourceMappingURL=documentoController.js.map