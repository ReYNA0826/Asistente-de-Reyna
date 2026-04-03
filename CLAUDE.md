# CLAUDE.md - Asistente de Reyna Codebase Guide

## Project Overview

**Asistente de Reyna** is a virtual assistant designed for **Reyna Vazquez** and the **Elio Vazquez Immigration Law Team**. It is a bilingual (primarily Spanish) project that combines AI-powered assistance with immigration law office operations, workflow automation, and educational content for the immigrant community.

The project has a **working Express.js backend** powered by **Claude (Anthropic SDK)**, with n8n workflow templates ready for integration. The goal is a fully functional API serving mobile apps (iPhone/Android), web interfaces, n8n automations, and internal office tools.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 3. Start server
npm start        # production
npm run dev      # development (auto-reload)

# 4. Test
curl http://localhost:3000/api/salud
```

## Repository Structure

```
/
├── CLAUDE.md                  # This file - AI assistant guide
├── README.md                  # Project overview and core logic description
├── package.json               # Node.js dependencies and scripts
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
│
├── index.js                   # Express server entry point
├── asistente.js               # Route: POST /api/asistente-reyna
├── salud.js                   # Route: GET /api/salud
├── asistenteController.js     # Controller: request processing, role detection
├── sistemaController.js       # Controller: system health status
├── claudeService.js           # Service: Anthropic Claude AI integration
├── openaiService.js           # Shim: re-exports from claudeService (backward compat)
├── memoriaService.js          # Service: 3-tier memory system
│
├── middleware/                 # Express middleware
│   └── autenticacion.js       # Token-based Bearer authentication
│
├── config/                    # System configuration
│   ├── settings.json          # Project metadata (version, language, AI model)
│   ├── endpoint.md            # API endpoint design spec
│   ├── environment.md         # Environment variables placeholder
│   ├── integracion.md         # Integration specs (n8n, Zapier, mobile app)
│   ├── interfaz.md            # Universal input/output interface spec
│   └── servidor.md            # Backend server architecture spec
│
├── data/                      # Office data and templates
│   ├── documentos_base.md     # Base documents index
│   ├── paralegales.js         # Paralegal team directory (canonical source)
│   └── plantillas/            # Document templates
│       ├── checklist_asilo.md       # Asylum case checklist
│       ├── checklist_turista.md     # Tourist visa checklist
│       └── cliente_intake.md        # Client intake form
│
├── docs/                      # Project documentation
│   └── README.md              # Full project documentation and roadmap
│
├── memoria/                   # Memory system
│   ├── README.md              # 3-tier memory architecture spec
│   ├── operativo/             # Tier 2: reusable office data
│   └── persistente/           # Tier 3: long-term storage
│
├── scripts/                   # Utility scripts
│   ├── README.md              # Scripts directory description
│   └── utilities.js           # Text utility (limpiarTexto) — canonical source
│
├── src/                       # Source code (re-exports)
│   └── data/
│       └── paralegales.js     # Re-exports from data/paralegales.js
│
├── workflow/                  # Automation workflows
│   ├── n8n/                   # n8n workflow templates
│   │   ├── README.md          # n8n setup guide and documentation
│   │   ├── asistente_reyna_basico.json  # Basic webhook → API flow
│   │   └── intake_cliente.json          # Client intake → Sheets flow
│   ├── scripts/
│   │   └── utilities.js       # Re-exports from scripts/utilities.js
│   ├── Carpeta: workflows → zapier  # Zapier workflow placeholder
│   └── Carpeta: scripts             # Scripts placeholder
│
├── personality.md             # Assistant personality profile
├── habilidades.md             # Advanced capabilities definition
├── logica.md                  # Internal decision logic engine
├── roles.md                   # 7-role system (paralegal, educator, creative, etc.)
├── comandos.md                # Command engine for complex instruction parsing
├── interfaz.md                # General interface spec (duplicate of config/interfaz.md)
├── seguridad.md               # Security and authentication design
└── servidor                   # Server structure overview (plain text)
```

## Key Architecture Decisions

### Language
- Primary language: **Spanish** (all documentation, comments, variable names)
- Code: **JavaScript (ES modules)** — uses `export`/`import` syntax
- AI assistants should write documentation and comments in Spanish unless explicitly asked otherwise

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js with CORS enabled
- **API Style**: REST (JSON in/out)
- **AI Integration**: Anthropic Claude API (`@anthropic-ai/sdk`)
- **Default Model**: `claude-sonnet-4-20250514` (configurable via `CLAUDE_MODEL` env var)
- **Automation**: n8n (workflow templates ready to import)
- **Hosting targets**: Vercel, Render, AWS, or Google Cloud

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key (`sk-ant-...`) |
| `CLAUDE_MODEL` | No | Claude model ID (default: `claude-sonnet-4-20250514`) |
| `PORT` | No | Server port (default: `3000`) |
| `TOKEN_SECRETO` | No | Bearer token for auth (if empty, auth is disabled) |

### API Design
- Main endpoint: `POST /api/asistente-reyna`
- Health check: `GET /api/salud`
- Root info: `GET /`

**Input format:**
```json
{
  "usuario": "Reyna",
  "mensaje": "...",
  "contexto": "operativo | educativo | creativo | técnico | emocional",
  "modo": "detallado | resumen | pasos | lista | creativo"
}
```

**Output format:**
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
The assistant operates under 7 internal roles defined in `roles.md` and implemented in `claudeService.js`:
1. **Paralegal** (Modo Operativo) — office templates, checklists, processes
2. **Educador Migratorio** (Modo Educativo) — immigration explanations for the community
3. **Creativo** (Modo Poetico) — emotional/poetic/inspirational content
4. **Estratega de Automatizacion** (Modo Tecnico) — n8n, Zapier, APIs, scripts
5. **Organizador** (Modo Productividad) — task management, plans, calendars
6. **Emocional** (Modo Apoyo) — empathetic support
7. **Ejecutivo** (Modo Direccion) — strategic decisions, team management

### Memory System
Three tiers implemented in `memoriaService.js`:
1. **Temporal** (Nivel 1) — in-memory Map, session-only (conversation context, temp data)
2. **Operativa** (Nivel 2) — file-based in `/memoria/operativo/` (templates, checklists, FAQs)
3. **Persistente** (Nivel 3) — JSON files in `/memoria/persistente/` (history, preferences)

### Authentication
Token-based Bearer auth implemented in `middleware/autenticacion.js`:
- If `TOKEN_SECRETO` env var is set, all requests to `/api/asistente-reyna` require `Authorization: Bearer <token>`
- If `TOKEN_SECRETO` is not set, auth is disabled (development mode)
- Health check (`/api/salud`) does not require authentication

### n8n Integration
Two workflow templates ready to import in `workflow/n8n/`:
- **`asistente_reyna_basico.json`** — basic webhook that forwards requests to the API
- **`intake_cliente.json`** — client intake that processes with AI and saves to Google Sheets
- See `workflow/n8n/README.md` for full setup instructions

## Development Conventions

### Code Style
- Use **ES module** syntax (`export const`, `import`)
- Variable and function names in **Spanish** (e.g., `limpiarTexto`, `paralegales`, `obtenerCliente`)
- Keep utility functions simple and focused
- JSON configuration files use lowercase keys in Spanish

### File Organization
- **Root `.js` files** — server code (routes, controllers, services)
- **Root `.md` files** — define assistant behavior (personality, roles, logic, commands)
- **`config/`** — system configuration and architecture specs
- **`data/`** — office operational data and templates (canonical source)
- **`middleware/`** — Express middleware (authentication, etc.)
- **`scripts/`** — utility functions (canonical source)
- **`memoria/`** — memory system storage
- **`workflow/n8n/`** — n8n workflow JSON templates

### Critical Rules
1. **Never fabricate legal information** — this is an immigration law assistant; accuracy is paramount
2. **Maintain "Estilo Reyna"** — warm, direct, professional, poetic when appropriate
3. **Data sensitivity** — `data/paralegales.js` contains real contact information for team members; treat as sensitive
4. **Bilingual awareness** — the project is primarily in Spanish; maintain this convention
5. **Canonical sources** — `data/paralegales.js` and `scripts/utilities.js` are the single sources of truth; other copies re-export from them

### Commit Messages
- Write commit messages in English
- Be descriptive about what was added or changed
- Reference the relevant module area (e.g., "Add paralegal data", "Update server architecture")

## Current State

### What Works
- Express server starts and responds on all routes
- Health check (`GET /api/salud`) returns system status
- Main endpoint (`POST /api/asistente-reyna`) validates input and processes through Claude
- Role detection based on context field
- Token-based authentication (optional)
- 3-tier memory service (temporal in-memory, operativo/persistente on disk)
- CORS enabled for cross-origin requests (n8n, mobile apps, web)
- n8n workflow templates ready to import

### What Needs Work
1. **Tests** — no test framework exists yet; consider adding Vitest
2. **ESLint** — no linter configured
3. **Zapier workflows** — placeholder only, no templates yet
4. **Duplicate `interfaz.md`** — root copy is identical to `config/interfaz.md`
5. **Mobile app** — future iPhone/Android app to consume the API
6. **Enhanced memory** — expand operativo/persistente with real office data

### Sensitive Data
The `data/paralegales.js` file contains real names, phone numbers, and email addresses. Do not expose this data in public-facing outputs, logs, or error messages.
