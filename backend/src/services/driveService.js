import fs from "fs";

export async function obterOuCriarPasta(drive,nome, parentId=null) {
    let query = `name = '${nome}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    // Se tiver parentId, procura dentro da pasta pai
    if (parentId) {
        query += ` and '${parentId}' in parents`;
    }

    const response = await drive.files.list({
        q: query,
        fields: 'files(id, name)'
    });

    // Pasta Já existe
    if (response.data.files.length > 0) {
        return response.data.files[0].id;
    }

    // Cria a pasta
    const fileMetaData = {
        name: nome,
        mimeType: 'application/vnd.google-apps.folder'
    }

    // Ajuste semnântico (evitar adicionar parents: [] nos metadados)
    if (parentId) {
        fileMetaData.parents = [parentId];
    }

    const folder = await drive.files.create({
        resource: fileMetaData,
        fields: 'id'
    });

    return folder.data.id;
}

export async function uploadDrive(drive, arquivo, pastaId) {
    const fileMetaData = {
        name: arquivo.originalname,
        parents: [pastaId]
    };

    const media = {
        mimeType: arquivo.mimetype,
        body: fs.createReadStream(arquivo.path)
    };

    try {
        const response = await drive.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        });

        fs.unlink(arquivo.path, (err) => {
            if (err) console.error("Erro ao excluir arquivo temporário: ", err);
        });

        return response.data.id;
    } catch (error) {
        if (fs.existsSync(arquivo.path)) fs.unlinkSync(arquivo.path);
        throw error;
    }
}