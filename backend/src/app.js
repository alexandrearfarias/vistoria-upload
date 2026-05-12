import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(cors({
    origins: [
        "http://localhost:5173",
        "https://vistoria-upload.vercel.app"
    ]
}));
app.use(express.json());

app.use("/upload", uploadRoutes);

app.get("/fixa", (req,res) => {
    res.send("API Online e Metendo.");
});

export default app;