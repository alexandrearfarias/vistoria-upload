import express from "express";
import { uploadArquivos } from "../controllers/uploadController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.array("arquivos"), uploadArquivos);

export default router;