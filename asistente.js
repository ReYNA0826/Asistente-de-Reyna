import { Router } from "express";
import { procesarSolicitud } from "./asistenteController.js";
import { verificarToken } from "./middleware/autenticacion.js";

export const rutasAsistente = Router();

// POST /api/asistente-reyna — Endpoint principal del asistente
rutasAsistente.post("/asistente-reyna", verificarToken, procesarSolicitud);
