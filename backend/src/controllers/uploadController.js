import { uploadDrive } from "../services/driveService";

export async function uploadArquivos(req, res) {
    try {
        const arquivo = req.files;

        for(const file of arquivos) {
            await uploadDrive(file);
        }

        res.json({ status: "success", message: "Upload Concluído" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: "Erro ao fazer o upload" + error });
    }
}