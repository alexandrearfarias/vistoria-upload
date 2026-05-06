import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoutes);

export default app;