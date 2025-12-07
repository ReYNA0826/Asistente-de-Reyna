# Endpoint Base del Asistente de Reyna Vázquez

Este documento define el diseño del endpoint (punto de entrada) que permitirá que aplicaciones externas, automatizaciones y servicios web interactúen con el asistente.

---

## 1. URL Base Propuesta

Ruta propuesta para consultas:

POST /api/asistente-reyna

El dominio final dependerá de dónde se aloje la API (por ejemplo: Vercel, Render, AWS, Google Cloud, Netlify Functions, etc.).

---

## 2. Formato de Entrada (Request)

Toda solicitud enviada al endpoint debe venir en formato JSON estructurado:

{
  "usuario": "Reyna",
  "mensaje": "explica requisitos de visa U",
  "contexto": "educativo",
  "modo": "detallado"
}

### Reglas:
- **usuario:** quién está usando el asistente.
- **mensaje:** lo que se desea procesar.
- **contexto:** define el tono o propósito (legal-educativo, creativo, interno del despacho, etc.).
- **modo:** puede ser "detallado", "simple", "lista", "explicación", "pasos".

El endpoint debe validar que "mensaje" nunca esté vacío.

---

## 3. Formato de Respuesta (Response)

El asistente devolverá JSON en estructura clara:

{
  "respuesta_larga": "...",
  "respuesta_corta": "...",
  "acciones": ["...","..."],
  "estado": "OK"
}

### Regla principal:
La respuesta debe ser fácil de usar por apps, flujos automáticos o chatbots.

---

## 4. Flujo General del Endpoint

1. Recibir JSON.
2. Validar campos.
3. Pasar el mensaje al asistente.
4. Procesar según modo y contexto.
5. Devolver JSON estructurado.
6. Registrar logs (opcional) para control.

---

## 5. Casos de Uso

- Aplicación móvil (iPhone/Android).
- Formularios inteligentes.
- Sistema web para paralegales.
- n8n → HTTP Request Node.
- Zapier → Webhooks by Zapier.
- Página web de Reyna.
- Integración futura con AI avanzada.

---

## 6. Visión a Futuro

Este endpoint será la base para:
- Crear la primera versión de la app.
- Generar notificaciones.
- Guardar conversaciones.
- Integrar con calendarios, correos y bases de datos.
- Hacer versiones personalizadas del asistente para diferentes equipos.

---

# Objetivo Final
Tener un estándar claro y profesional que permita que cualquier tecnología futura pueda conectarse al Asistente de Reyna sin confusión, errores o improvisaciones.
