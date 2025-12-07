# Sistema de Memoria del Asistente de Reyna Vázquez

Este módulo define cómo el asistente gestionará información interna: datos temporales, logs, historial, notas operativas y registros para futuras aplicaciones móviles o paneles web.

La memoria se divide en 3 niveles:

---

## 1. Memoria Temporal (Nivel 1)
Información que solo dura durante una sesión o automatización:

- Última solicitud procesada.
- Pasos generados recientemente.
- Listas o estructuras temporales.
- Contexto inmediato de la conversación.

Uso típico:
- n8n y Zapier cuando ejecutan flujos.
- Conversaciones cortas.
- Resúmenes rápidos.

No se almacena permanentemente.

---

## 2. Memoria Operativa (Nivel 2)
Aquí se guarda información útil para el trabajo del despacho:

- Plantillas generadas.
- Checklists personalizadas.
- Explicaciones educativas.
- Respuestas frecuentes.
- Procesos internos mejorados.
- Notas que Reyna desee conservar.

Se recomienda guardar estos archivos como Markdown en este mismo directorio:
`/memoria/operativo/`

Ejemplo de archivo:
`/memoria/operativo/visa_u_checklist_2025.md`

---

## 3. Memoria Persistente (Nivel 3)
Pensada para tu futura app o interfaz web.

Incluye:
- Historial simplificado de interacciones.
- Configuraciones de usuario.
- Preferencias de Reyna.
- Registro de automatizaciones importantes.

Estos archivos se almacenarán en:
`/memoria/persistente/`

Formato sugerido:
- JSON  
- Markdown  
- Texto estructurado  

---

## Estructura Recomendada

/memoria  
│  
├── README.md  
│  
├── operativo/  
│   ├── notas/  
│   ├── plantillas/  
│   └── procesos/  
│  
└── persistente/  
    ├── historial/  
    ├── configuraciones/  
    └── proyectos/  

---

## Objetivo del Sistema de Memoria

- Permitir que el asistente crezca.
- Preparar la base para una aplicación móvil.
- Guardar información valiosa del despacho.
- Registrar procesos reales.
- Facilitar trabajo futuro en automatizaciones.

La memoria convierte al Asistente de Reyna en una herramienta REAL, útil, constante y preparada para evolucionar.
