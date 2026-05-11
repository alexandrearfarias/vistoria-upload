import { criarDriveClient, ObterInfosUsuario } from "../config/google.js";
import { uploadDrive, obterOuCriarPasta } from "../services/driveService.js";
import { driveCache } from "../../cache/driveCache.js";

export async function uploadArquivos(req, res) {
    try {
        const userInfo = await ObterInfosUsuario(req.accessToken);
        const userId = userInfo.email;
        const drive = criarDriveClient(req.accessToken);
        const { cidade, local, item } = req.body;
        const arquivos = req.files;

        const cidadeKey = cidade.trim().toLowerCase();
        const localKey = local.trim().toLowerCase();
        const itemKey = item.trim().toLowerCase();

        // sistema de cache p evitar busca de ids de pasta toda hora
        let cacheUser = driveCache.get(userId);
        if (!cacheUser) {
            cacheUser = {
                cidades: {}
            };
            driveCache.set(userId, cacheUser);
        }

        if (!cidade || !local || !item) {
            return res.status(400).json({ status: "error", message: "Ciidade, Item e Local são obrigatórios." });
        }
        if (!arquivos || arquivos.length === 0) {
            return res.status(400).json({ status: "error", message: "Nenhum arquivo enviado." });
        }

        // Pasta Raiz
        if (!cacheUser.pastaRaizId) {
            cacheUser.pastaRaizId = await obterOuCriarPasta(drive,'Vistorias Tecnicas');
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
            arquivos.map( file => {
                uploadDrive(drive, file, cacheUser.cidades[cidadeKey].locais[localKey].items[itemKey]);
            })
        );

        return res.json({ status: "success", message: "Upload Concluído" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Erro ao fazer o upload", error });
    }
}