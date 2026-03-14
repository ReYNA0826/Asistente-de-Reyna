# Configuración de Workflows N8N - Asistente de Reyna

## Workflows incluidos

| Archivo | Descripción | Trigger |
|---------|-------------|---------|
| `workflow-correos-autorespuesta.json` | Revisa correos → Alma genera respuesta → Notifica a Reyna | Cada 15 minutos |
| `workflow-resumen-diario.json` | Recopila correos + recordatorios + Monday → Resumen matutino | Lunes a Viernes 7:00 AM |
| `workflow-intake-clientes.json` | Formulario → Alma evalúa → Monday.com + Sheets + Email | Webhook (POST) |

---

## Paso 1: Variables de entorno en N8N

Configura estas variables en **Settings → Variables** de tu instancia n8n:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `ALMA_API_URL` | `https://tu-dominio.com` | URL base del servidor del Asistente |
| `REYNA_EMAIL` | `reyna@tudominio.com` | Email donde Reyna recibe notificaciones |
| `GOOGLE_SHEET_CORREOS_ID` | `1abc...xyz` | ID del Google Sheet para log de correos |
| `GOOGLE_SHEET_RESUMENES_ID` | `1abc...xyz` | ID del Google Sheet para resúmenes diarios |
| `GOOGLE_SHEET_INTAKE_ID` | `1abc...xyz` | ID del Google Sheet para intake de clientes |
| `MONDAY_INTAKE_BOARD_ID` | `123456789` | ID del tablero de Monday.com para intake |

---

## Paso 2: Credenciales en N8N

Configura estas credenciales en **Settings → Credentials**:

### Google Sheets OAuth2
1. Ir a Google Cloud Console → APIs & Services → Credentials
2. Crear OAuth 2.0 Client ID
3. En n8n: crear credencial "Google Sheets OAuth2 API"
4. Autorizar con la cuenta de Google de Reyna

### SMTP (para enviar emails)
1. En n8n: crear credencial "SMTP"
2. Configurar con los datos de tu proveedor de email:
   - **Gmail**: Host: `smtp.gmail.com`, Port: `465`, SSL: `true`
   - **Outlook**: Host: `smtp.office365.com`, Port: `587`, STARTTLS: `true`
3. Usar App Password si tienes 2FA activado

---

## Paso 3: Importar workflows

1. Abrir tu instancia de n8n
2. Ir a **Workflows → Import from File**
3. Seleccionar cada archivo `.json` de esta carpeta
4. En cada workflow importado:
   - Actualizar las credenciales (click en nodos con advertencia)
   - Verificar que las variables de entorno estén correctas
   - Hacer un **test manual** antes de activar

---

## Paso 4: Crear Google Sheets

### Sheet "Respuestas Alma" (para correos)
Columnas: `Fecha | De | Asunto | Respuesta Alma | Intención | Estado`

### Sheet "Resúmenes Diarios"
Columnas: `Fecha | Día | Resumen Alma | Monday.com`

### Sheet "Intake Clientes"
Columnas: `Fecha | Nombre | Teléfono | Email | Tipo de Caso | Descripción | Urgencia | Evaluación Alma | Estado`

---

## Paso 5: Webhook de Intake

Una vez importado el workflow de intake, n8n generará una URL de webhook. Ejemplo:

```
POST https://tu-n8n.com/webhook/intake-reyna
```

### Formato del body (JSON):

```json
{
  "nombre": "María García",
  "telefono": "+1 (555) 123-4567",
  "email": "maria@ejemplo.com",
  "tipo_caso": "Visa U",
  "descripcion": "Víctima de crimen doméstico, necesita asesoría sobre el proceso de Visa U",
  "urgencia": "Alta",
  "referido_por": "Organización comunitaria XYZ"
}
```

Campos requeridos: `nombre`, `tipo_caso`
Campos opcionales: `telefono`, `email`, `descripcion`, `urgencia`, `referido_por`

### Conectar con formulario web:
Puedes conectar este webhook con:
- **Typeform**: Usar webhook nativo de Typeform
- **Google Forms**: Conectar con Google Apps Script → HTTP POST al webhook
- **Página web propia**: Formulario HTML con fetch/axios al webhook
- **JotForm, Tally, etc.**: Todos soportan webhooks

---

## Flujos visuales

### 1. Correos Auto-Respuesta
```
⏰ Cada 15 min → 📧 Obtener correos → ❓ ¿Hay nuevos?
    → Sí → 🔄 Separar → 🤖 Alma responde → 📊 Sheets + 📧 Email a Reyna
    → No → (fin)
```

### 2. Resumen Diario
```
⏰ L-V 7AM → [📧 Correos + 📋 Recordatorios + 📊 Monday] (paralelo)
    → 🔀 Combinar → 🤖 Alma genera resumen → 📧 Email + 📊 Sheets
```

### 3. Intake de Clientes
```
🌐 Webhook POST → ❓ ¿Datos válidos?
    → Sí → 🤖 Alma evalúa → [📊 Monday + 📊 Sheets + 📧 Email] (paralelo) → ✅ OK
    → No → ❌ Error 400
```
