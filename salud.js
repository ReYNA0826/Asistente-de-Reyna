import { Router } from "express";
import { obtenerEstadoSistema } from "./sistemaController.js";

export const rutasSalud = Router();

// GET /api/salud — Health check
rutasSalud.get("/salud", obtenerEstadoSistema);
