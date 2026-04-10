import express from "express";
import cors from "cors";
import mailRoutes from "./routes/mail.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/mail", mailRoutes);

export default app;
