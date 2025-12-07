# Documentación General del Asistente de Reyna Vázquez

Este repositorio contiene la arquitectura, configuración y diseño del **Asistente Virtual de Reyna Vázquez**, pensado para:

- apoyar el trabajo del despacho Elio Vázquez Immigration Law Team,
- servir como base para automatizaciones (n8n, Zapier, etc.),
- convertirse en una API y, en el futuro, en una aplicación móvil (iPhone y Android).

---

## 1. Estructura Principal del Proyecto

- **config/**  
  Configuración del sistema:
  - `settings.json` → claves, opciones generales.
  - `environment.md` → notas de entorno.
  - `integracion.md` → cómo se conecta con otros sistemas.
  - `endpoint.md` → diseño del endpoint principal.
  - `interfaz.md` → interfaz universal de entrada/salida.
  - `seguridad.md` → diseño del sistema de seguridad.
  - `servidor.md` → plano de la arquitectura del backend.

- **data/**  
  Plantillas, checklists, documentos base.

- **memoria/**  
  Diseño del sistema de memoria:
  - memoria temporal
  - memoria operativa
  - memoria persistente

- **scripts/**  
  Lugar para funciones auxiliares y conexión a APIs.

- **workflow/**  
  Espacio para flujos de trabajo (n8n, Zapier, etc.).

- **servidor/**  
  Estructura del backend futuro:
  - `rutas/` → archivos de rutas (asistente, salud, etc.).
  - `controladores/` → lógica que procesará las solicitudes.
  - `servicios/` → conexión con IA, memoria, seguridad, etc.
  - `README.md` → explicación del servidor.

- **prompts (archivos .md en la raíz)**  
  - `personality.md` → personalidad del asistente.  
  - `habilidades.md` → habilidades avanzadas.  
  - `logica.md` → motor de lógica interna.  
  - `roles.md` → sistema de roles.  
  - `comandos.md` → motor de comandos.  

---

## 2. Estado Actual del Proyecto

Actualmente este repositorio define:

- Identidad del asistente (quién es, cómo habla, cómo piensa).
- Habilidades y roles internos.
- Lógica de decisiones y manejo de órdenes complejas.
- Sistema de memoria.
- Diseño de integración con otros sistemas.
- Arquitectura del servidor y seguridad básica.

Es una **base sólida de producto**, lista para que se le agregue código real.

---

## 3. Cómo se Usará en el Futuro

1. Implementar el servidor definido en `config/servidor.md` y carpeta `servidor/`.
2. Conectar el asistente a una API de IA.
3. Integrar el endpoint `/api/asistente-reyna` con:
   - una app móvil (iPhone),
   - flujos n8n,
   - formularios web,
   - panel interno del despacho.
4. Usar la carpeta `memoria/` para almacenar historial y plantillas importantes.
5. Ajustar `settings.json` y `seguridad.md` para controlar el acceso.

---

## 4. Próximos Pasos Recomendados

1. Crear el primer servidor real en Node.js usando la estructura de `servidor/`.
2. Conectar una ruta de prueba (`/api/salud`) para verificar que todo corre.
3. Crear un flujo en n8n que llame al asistente usando el endpoint diseñado.
4. Diseñar el primer prototipo de app (iPhone) que consuma esa API.
5. Seguir ampliando plantillas, checklists y memoria operativa del despacho.

---

## 5. Visión

El objetivo final es que el **Asistente de Reyna Vázquez** sea:

- una herramienta interna para el despacho,
- una plataforma educativa para la comunidad inmigrante,
- y el corazón de futuras aplicaciones móviles y web creadas por Reyna.
