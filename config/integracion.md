# Módulo de Integración del Asistente de Reyna Vázquez

Este documento define cómo interactúa el asistente con sistemas externos: automatizaciones, APIs, aplicaciones móviles, flujos web y servicios conectados.

---

## 1. Formato de Entrada
El asistente recibirá información externa siempre en formato estructurado. Ejemplo:

{
  "usuario": "Reyna",
  "tarea": "describir",
  "contenido": "explica los requisitos de visa U",
  "contexto": "educativo"
}

Reglas:
- Siempre incluir el campo "tarea".
- Cuando sea información para procesar, incluir "contenido".
- Cuando sea una conversación, incluir "contexto".
- El asistente debe interpretar incluso si faltan campos, pero sin inventar datos legales.

---

## 2. Formato de Salida
El asistente responderá de forma clara y estructurada:

{
  "respuesta": "... texto elaborado ...",
  "resumen": "... versión corta ...",
  "acciones_sugeridas": ["...","..."]
}

Objetivo: permitir que la respuesta pueda ser usada por apps, flujos o interfaces.

---

## 3. Integración con n8n
El asistente actuará como módulo de:

- Resumen automático de información.
- Limpieza de texto.
- Generador de respuestas profesionales.
- Analizador de contenido (no legal).
- Conversor de ideas a pasos automáticos.

Se recomienda conectar mediante:
➡️ Nodo HTTP Request  
➡️ Formato JSON entrada/salida  
➡️ Guardar logs en Google Drive o Sheets

---

## 4. Integración con Zapier
Tareas típicas:
- Generación de correos.
- Conversión de texto.
- Limpieza y formato.
- Respuestas automáticas.
- Actualización de bases de datos o plantillas.

El mensaje se enviará en JSON desde Zapier y regresará el mismo formato estructurado.

---

## 5. Preparación para Aplicación Móvil (iPhone y luego Android)
El asistente será llamado desde un endpoint API, usando:

POST /asistente_reyna

Entradas:
- usuario
- mensaje
- contexto
- tipo_de_respuesta

Salidas:
- respuesta_larga
- respuesta_corta
- acciones
- metadatos

La app móvil usará este formato para mostrar respuestas rápidas, estructuradas y limpias.

---

## 6. Objetivo del Módulo de Integración
Permitir que el asistente funcione como:

- Motor de lenguaje
- Organizador de información
- Módulo de automatización
- Base para futuras aplicaciones
- Herramienta interna del despacho

Siempre con compatibilidad futura para aplicaciones móviles, bots web y flujos automáticos.
