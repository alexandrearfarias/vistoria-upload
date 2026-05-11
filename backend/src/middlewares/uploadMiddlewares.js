import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.resolve("cache");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, "-");
        cb(null, `${Date.now()}-${safeName}`);
    }
});

export const upload = multer({ storage });