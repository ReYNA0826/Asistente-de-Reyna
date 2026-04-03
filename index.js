import "dotenv/config";
import express from "express";
import { rutasAsistente } from "./asistente.js";
import { rutasSalud } from "./salud.js";

const app = express();
const PUERTO = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Rutas
app.use("/api", rutasAsistente);
app.use("/api", rutasSalud);

// Ruta raíz
app.get("/", (_req, res) => {
  res.json({
    mensaje: "Asistente de Reyna Vázquez — API activa",
    version: "1.0",
    endpoints: {
      asistente: "POST /api/asistente-reyna",
      salud: "GET /api/salud",
    },
  });
});

app.listen(PUERTO, () => {
  console.log(`Servidor del asistente funcionando en puerto ${PUERTO}`);
});

export default app;
