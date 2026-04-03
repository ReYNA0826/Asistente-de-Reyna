# Flujos n8n del Asistente de Reyna

## Flujos Disponibles

### 1. `asistente_reyna_basico.json` — Flujo Básico
Un webhook que recibe solicitudes y las envía a la API del asistente.

**Cómo funciona:**
1. Recibe un POST en el webhook de n8n
2. Llama a `POST /api/asistente-reyna` con el mensaje
3. Devuelve la respuesta de Claude al sistema que lo llamó

**Ejemplo de uso desde cualquier sistema:**
```json
POST https://tu-n8n.com/webhook/asistente-reyna
{
  "usuario": "Reyna",
  "mensaje": "Dame un checklist para visa U",
  "contexto": "operativo",
  "modo": "pasos"
}
```

---

### 2. `intake_cliente.json` — Intake de Cliente
Procesa nuevos clientes: el asistente genera un resumen y se guarda en Google Sheets.

**Cómo funciona:**
1. Recibe datos del cliente (nombre, tipo de caso, notas)
2. El asistente procesa y genera resumen + próximos pasos
3. Guarda en Google Sheets automáticamente
4. Responde con el resumen generado

**Ejemplo de uso:**
```json
POST https://tu-n8n.com/webhook/intake-cliente
{
  "nombre": "María García",
  "tipo_caso": "Asilo",
  "notas": "Llegó de Venezuela, tiene miedo de regresar"
}
```

---

## Configuración en n8n

### Variables de Entorno Requeridas
Configura estas variables en **Settings → Variables** dentro de tu n8n:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `ASISTENTE_API_URL` | `https://tu-servidor.com` | URL donde corre tu API |
| `ASISTENTE_TOKEN` | `tu-token-secreto` | Mismo valor que `TOKEN_SECRETO` en tu `.env` |
| `GOOGLE_SHEET_ID` | `abc123...` | ID de tu Google Sheet (solo para intake) |

### Cómo Importar un Flujo
1. Abre tu n8n
2. Ve a **Workflows → Import from File**
3. Selecciona el archivo `.json` que quieras
4. Configura las variables de entorno
5. Activa el workflow

### Cómo Conectar Google Sheets (para intake)
1. En n8n, ve a **Credentials → Add Credential → Google Sheets**
2. Conecta tu cuenta de Google
3. Crea un Google Sheet con una hoja llamada "Intakes"
4. Columnas: `fecha`, `nombre`, `tipo_caso`, `resumen_ia`, `estado`
5. Copia el ID del Sheet y agrégalo como variable `GOOGLE_SHEET_ID`

---

## Flujos Futuros Recomendados

- **Recordatorios automáticos** — enviar alertas a paralegales sobre casos pendientes
- **Generador de documentos** — crear cartas y checklists automáticamente
- **Monitor de casos** — revisar estado de casos periódicamente
- **Educación comunitaria** — generar contenido educativo y publicar en redes
