# Arquitectura del Servidor Base del Asistente de Reyna Vázquez

Este documento define la estructura inicial del backend que permitirá que el asistente funcione como una API para aplicaciones móviles, webs y automatizaciones.

---

# 1. Objetivo del Servidor
El servidor actuará como el “cerebro externo” que recibe solicitudes desde:

- iPhone / Android (app futura)
- Página web
- n8n
- Zapier
- Bots
- Herramientas internas del despacho
- Scripts externos

---

# 2. Arquitectura Propuesta

Tecnologías recomendadas (para futuro desarrollo):
- Node.js / JavaScript  
- Express.js  
- API REST  
- OpenAI / APIs externas  
- Hosting: Vercel, Render, AWS, Google Cloud  

Estructura inicial del proyecto:

/servidor  
│  
├── index.js  
├── rutas/  
│   ├── asistente.js  
│   └── salud.js  
├── controladores/  
│   ├── asistenteController.js  
│   └── sistemaController.js  
├── servicios/  
│   ├── openaiService.js  
│   └── memoriaService.js  
└── README.md  

---

# 3. Flujo General del Servidor

1. Recibir solicitud POST en `/api/asistente-reyna`
2. Validar datos de entrada (usuario, instrucción, contexto)
3. Pasar datos al asistente interno
4. Procesar la respuesta con:
   - lógica interna (logica.md)
   - roles (roles.md)
   - motor de comandos (comandos.md)
   - habilidades (habilidades.md)
5. Generar formato JSON estructurado de salida
6. Responder al sistema que hizo la solicitud

---

# 4. Ejemplo de index.js

```javascript
const express = require("express");
const app = express();
app.use(express.json());

const asistenteRutas = require("./rutas/asistente");

app.use("/api", asistenteRutas);

app.listen(3000, () => {
  console.log("Servidor del asistente funcionando en puerto 3000");
});
