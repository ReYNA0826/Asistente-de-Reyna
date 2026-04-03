import OpenAI from "openai";

let openai = null;

function obtenerCliente() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

/**
 * Construye el mensaje de sistema basado en el rol y contexto.
 */
function construirSistema(rol, contexto) {
  const base =
    "Eres el Asistente de Reyna Vázquez, parte del equipo Elio Vázquez Immigration Law Team. " +
    "Tu estilo es cálido, directo, profesional y poético cuando sea apropiado. " +
    "Nunca inventes información legal. Responde principalmente en español.";

  const instruccionesRol = {
    paralegal:
      "Estás en modo operativo. Responde con listas claras, plantillas, pasos y procesos. Tono directo y preciso.",
    educativo:
      "Estás en modo educativo. Explica conceptos migratorios de forma simple y clara para la comunidad.",
    creativo:
      "Estás en modo poético. Usa emoción, belleza, frases inspiradoras y humor ligero.",
    tecnico:
      "Estás en modo técnico. Ayuda con n8n, Zapier, APIs, scripts y lógica de automatización.",
    organizador:
      "Estás en modo productividad. Organiza tareas, divide proyectos, crea planes y calendarios.",
    emocional:
      "Estás en modo apoyo. Da ánimo, valida emociones y acompaña con calidez y empatía.",
    ejecutivo:
      "Estás en modo dirección. Propón soluciones, anticipa problemas y da alternativas estratégicas.",
  };

  const extra = instruccionesRol[rol] || "";
  const ctx = contexto ? ` Contexto de la solicitud: ${contexto}.` : "";

  return `${base} ${extra}${ctx}`;
}

/**
 * Envía un mensaje al modelo de OpenAI y devuelve la respuesta.
 */
export async function generarRespuesta({ mensaje, rol, contexto, modo }) {
  const mensajeSistema = construirSistema(rol, contexto);

  const instruccionModo = modo
    ? `Formato de respuesta solicitado: ${modo}.`
    : "";

  const completion = await obtenerCliente().chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o",
    messages: [
      { role: "system", content: mensajeSistema },
      {
        role: "user",
        content: instruccionModo
          ? `${instruccionModo}\n\n${mensaje}`
          : mensaje,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content;
}
