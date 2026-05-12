import { criarDriveClient, ObterInfosUsuario } from "../config/google.js";
import { uploadDrive, obterOuCriarPasta } from "../services/driveService.js";
import { driveCache } from "../../cache/driveCache.js";
import fs from "fs";

export async function uploadArquivos(req, res) {
    try {
        const { cidade, local, item } = req.body;
        const arquivos = req.files;

        if (!cidade || !local || !item) {
            return res.status(400).json({ status: "error", message: "Cidade, Item e Local sao obrigatorios." });
        }
        if (!arquivos || arquivos.length === 0) {
            return res.status(400).json({ status: "error", message: "Nenhum arquivo enviado." });
        }

        const userInfo = await ObterInfosUsuario(req.accessToken);
        const userId = userInfo.email;
        const drive = criarDriveClient(req.accessToken);

        const cidadeKey = cidade.trim().toLowerCase();
        const localKey = local.trim().toLowerCase();
        const itemKey = item.trim().toLowerCase();

        // Sistema de cache para evitar buscar ids de pasta toda hora.
        let cacheUser = driveCache.get(userId);
        if (!cacheUser) {
            cacheUser = {
                cidades: {}
            };
            driveCache.set(userId, cacheUser);
        }

        // Pasta raiz
        if (!cacheUser.pastaRaizId) {
            cacheUser.pastaRaizId = await obterOuCriarPasta(drive, "Vistorias Tecnicas");
        }

        // Cidade
        if (!cacheUser.cidades[cidadeKey]) {
            const idCidade = await obterOuCriarPasta(drive, cidade, cacheUser.pastaRaizId);
            cacheUser.cidades[cidadeKey] = { id: idCidade, locais: {} };
        }

        // Local
        if (!cacheUser.cidades[cidadeKey].locais[localKey]) {
            const idLocal = await obterOuCriarPasta(drive, local, cacheUser.cidades[cidadeKey].id);
            cacheUser.cidades[cidadeKey].locais[localKey] = { id: idLocal, items: {} };
        }

        // Item
        if (!cacheUser.cidades[cidadeKey].locais[localKey].items[itemKey]) {
            const idItem = await obterOuCriarPasta(drive, item, cacheUser.cidades[cidadeKey].locais[localKey].id);
            cacheUser.cidades[cidadeKey].locais[localKey].items[itemKey] = idItem;
        }

        // Upload dos arquivos
        await Promise.all(
            arquivos.map(file =>
                uploadDrive(drive, file, cacheUser.cidades[cidadeKey].locais[localKey].items[itemKey])
            )
        );

        return res.json({ status: "success", message: "Upload Concluido" });
    } catch (error) {
        console.log(error);
        // Limpar arquivos temporários em caso de erro
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        return res.status(500).json({ status: "error", message: "Erro ao fazer o upload", error });
    }
}
