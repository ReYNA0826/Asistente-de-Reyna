# CLAUDE.md - Asistente de Reyna Codebase Guide

## Project Overview

**Asistente de Reyna** is a virtual assistant designed for **Reyna Vazquez** and the **Elio Vazquez Immigration Law Team**. It is a bilingual (primarily Spanish) project that combines AI-powered assistance with immigration law office operations, workflow automation, and educational content for the immigrant community.

The project is currently in an **architecture and design phase** — most files define specifications, structures, and templates rather than running application code. The goal is to evolve into a fully functional backend API serving mobile apps (iPhone/Android), web interfaces, n8n/Zapier automations, and internal office tools.

## Repository Structure

```
/
├── CLAUDE.md                  # This file - AI assistant guide
├── README.md                  # Project overview and core logic description
├── config/                    # System configuration
│   ├── settings.json          # Project metadata (version, language, AI model)
│   ├── endpoint.md            # API endpoint design (POST /api/asistente-reyna)
│   ├── environment.md         # Environment variables placeholder
│   ├── integracion.md         # Integration specs (n8n, Zapier, mobile app)
│   ├── interfaz.md            # Universal input/output interface spec
│   └── servidor.md            # Backend server architecture (Node.js/Express)
├── data/                      # Office data and templates
│   ├── documentos_base.md     # Base documents index
│   ├── paralegales.js         # Paralegal team directory (ES module export)
│   └── plantillas/            # Document templates
│       ├── checklist_asilo.md       # Asylum case checklist
│       ├── checklist_turista.md     # Tourist visa checklist
│       └── cliente_intake.md        # Client intake form
├── docs/                      # Project documentation
│   └── README.md              # Full project documentation and roadmap
├── memoria/                   # Memory system design
│   └── README.md              # 3-tier memory architecture spec
├── scripts/                   # Utility scripts
│   ├── README.md              # Scripts directory description
│   └── utilities.js           # Text utility (limpiarTexto)
├── src/                       # Source code
│   └── data/
│       └── paralegales.js     # Paralegal data (formatted version)
├── workflow/                  # Automation workflows
│   ├── Carpeta: workflows → n8n     # n8n workflow placeholder
│   ├── Carpeta: workflows → zapier  # Zapier workflow placeholder
│   ├── Carpeta: scripts             # Scripts placeholder
│   └── scripts/
│       └── utilities.js       # Workflow text utility
├── personality.md             # Assistant personality profile
├── habilidades.md             # Advanced capabilities definition
├── logica.md                  # Internal decision logic engine
├── roles.md                   # 7-role system (paralegal, educator, creative, etc.)
├── comandos.md                # Command engine for complex instruction parsing
├── interfaz.md                # General interface spec (input/output processing)
├── seguridad.md               # Security and authentication design
├── servidor                   # Server structure overview (plain text)
├── asistente.js               # Route file placeholder (empty)
├── asistenteController.js     # Controller placeholder (empty)
├── openaiService.js           # OpenAI service placeholder (empty)
├── memoriaService.js          # Memory service placeholder (empty)
├── salud.js                   # Health check route placeholder (empty)
└── sistemaController.js       # System controller placeholder (empty)
```

## Key Architecture Decisions

### Language
- Primary language: **Spanish** (all documentation, comments, variable names)
- Code: **JavaScript (ES modules)** — uses `export` syntax
- AI assistants should write documentation and comments in Spanish unless explicitly asked otherwise

### Tech Stack (Planned)
- **Runtime**: Node.js
- **Framework**: Express.js
- **API Style**: REST (JSON in/out)
- **AI Integration**: OpenAI API (configured as GPT-5.1 in settings.json)
- **Hosting targets**: Vercel, Render, AWS, or Google Cloud
- **Automation**: n8n, Zapier

### API Design
- Main endpoint: `POST /api/asistente-reyna`
- Health check: `GET /api/salud`
- Input format:
  ```json
  {
    "usuario": "Reyna",
    "mensaje": "...",
    "contexto": "operativo | educativo | creativo | técnico | emocional",
    "modo": "detallado | resumen | pasos | lista | creativo"
  }
  ```
- Output format:
  ```json
  {
    "respuesta": "full text",
    "resumen": "short version",
    "acciones": ["step 1", "step 2"],
    "contexto_detectado": "...",
    "rol_usado": "...",
    "estado": "OK"
  }
  ```

### Role System
The assistant operates under 7 internal roles defined in `roles.md`:
1. **Paralegal** (Modo Operativo) — office templates, checklists, processes
2. **Educador Migratorio** (Modo Educativo) — immigration explanations for the community
3. **Creativo** (Modo Poetico) — emotional/poetic/inspirational content
4. **Estratega de Automatizacion** (Modo Tecnico) — n8n, Zapier, APIs, scripts
5. **Organizador** (Modo Productividad) — task management, plans, calendars
6. **Emocional** (Modo Apoyo) — empathetic support
7. **Ejecutivo** (Modo Direccion) — strategic decisions, team management

### Memory System
Three tiers defined in `memoria/README.md`:
1. **Temporal** — session-only data (conversation context, temp lists)
2. **Operativa** — reusable office data (templates, checklists, FAQs) in `/memoria/operativo/`
3. **Persistente** — long-term storage for future app (history, preferences) in `/memoria/persistente/`

## Development Conventions

### Code Style
- Use **ES module** syntax (`export const`, `import`)
- Variable and function names in **Spanish** (e.g., `limpiarTexto`, `paralegales`)
- Keep utility functions simple and focused
- JSON configuration files use lowercase keys in Spanish

### File Organization
- **Root `.md` files** — define assistant behavior (personality, roles, logic, commands)
- **`config/`** — system configuration and architecture specs
- **`data/`** — office operational data and templates
- **`src/`** — source code (currently minimal)
- **`scripts/`** and **`workflow/scripts/`** — utility functions
- **`memoria/`** — memory system (currently spec only)

### Critical Rules
1. **Never fabricate legal information** — this is an immigration law assistant; accuracy is paramount
2. **Maintain "Estilo Reyna"** — warm, direct, professional, poetic when appropriate
3. **Data sensitivity** — `data/paralegales.js` contains real contact information for team members; treat as sensitive
4. **Bilingual awareness** — the project is primarily in Spanish; maintain this convention
5. **Placeholder files** — several `.js` files at root are empty placeholders awaiting implementation; they correspond to the server architecture in `config/servidor.md`

### Commit Messages
- Write commit messages in English
- Be descriptive about what was added or changed
- Reference the relevant module area (e.g., "Add paralegal data", "Update server architecture")

## Current State and Next Steps

### What Exists
- Complete behavioral specification for the assistant (personality, roles, logic, commands)
- API endpoint and server architecture design documents
- Security module design
- Integration specs for n8n, Zapier, and mobile apps
- Office templates (asylum checklist, tourist visa checklist, client intake)
- Paralegal team directory data
- Basic utility function (`limpiarTexto`)

### What Needs Implementation
1. **Backend server** — implement Express.js server per `config/servidor.md` structure
2. **Route handlers** — flesh out `asistente.js` and `salud.js` routes
3. **Controllers** — implement `asistenteController.js` and `sistemaController.js`
4. **Services** — implement `openaiService.js` (AI integration) and `memoriaService.js` (memory)
5. **Security** — implement token-based authentication per `seguridad.md`
6. **Memory directories** — create `memoria/operativo/` and `memoria/persistente/` structures
7. **Workflow automation** — build actual n8n/Zapier flows
8. **Tests** — no test framework exists yet; consider adding one when implementation begins
9. **Package management** — no `package.json` exists yet; needs to be created for Node.js dependencies

### Important Note on Duplicated Files
- `data/paralegales.js` and `src/data/paralegales.js` contain similar but not identical data
- `scripts/utilities.js` and `workflow/scripts/utilities.js` are identical copies
- `interfaz.md` (root) and `config/interfaz.md` are duplicates
- When implementing, consolidate to avoid drift between copies

## Working with This Repository

### No Build/Test System Yet
There is no `package.json`, no build system, no test framework, and no linter configured. When implementation begins:
- Initialize with `npm init`
- Add Express.js as dependency
- Add a test framework (e.g., Jest or Vitest)
- Add ESLint for code quality

### Sensitive Data
The `data/paralegales.js` file contains real names, phone numbers, and email addresses. Do not expose this data in public-facing outputs, logs, or error messages.

### Adding New Features
When adding new functionality:
1. Check if a design spec already exists in `config/` or root `.md` files
2. Follow the established JSON input/output format for the API
3. Maintain the role-based architecture
4. Keep the Spanish naming convention for user-facing code and data
5. Place templates in `data/plantillas/`
6. Place reusable office documents in `memoria/operativo/`
