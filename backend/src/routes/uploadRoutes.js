import express from "express";
import { uploadArquivos } from "../controllers/uploadController.js";
import { upload } from "../middlewares/uploadMiddlewares.js";
import { extrairToken } from "../middlewares/googleAuth.js";

const router = express.Router();

router.post("/", 
    extrairToken,
    upload.array("arquivos"), 
    uploadArquivos);

export default router;