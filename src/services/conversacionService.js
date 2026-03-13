/**
 * Servicio de Conversación - El cerebro de Alma
 *
 * Gestiona la conversación con el usuario usando OpenAI.
 * Alma interpreta intenciones, clasifica correos, gestiona recordatorios
 * y responde con calidez y profesionalismo.
 */

const OpenAI = require('openai');
const { PERSONALIDAD_ALMA } = require('../config/personalidad');

class ConversacionService {
  constructor() {
    this.openai = null;
    this.conversaciones = new Map(); // userId → historial de mensajes
  }

  _getClient() {
    if (!this.openai) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return this.openai;
  }

  /**
   * Envía un mensaje a Alma y obtiene su respuesta
   * @param {string} userId - Identificador del usuario
   * @param {string} mensaje - Lo que el usuario dice o escribe
   * @param {object} contexto - Datos adicionales (correos, recordatorios, hora del día)
   * @returns {object} { respuesta, intencion }
   */
  async enviarMensaje(userId, mensaje, contexto = {}) {
    const client = this._getClient();
    const historial = this.conversaciones.get(userId) || [];

    // Construir contexto del sistema
    const sistemaMsg = this._construirContexto(contexto);

    // Agregar mensaje del usuario al historial
    historial.push({ role: 'user', content: mensaje });

    // Limitar historial a últimos 20 mensajes para no exceder tokens
    const historialReciente = historial.slice(-20);

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: sistemaMsg },
        ...historialReciente
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const respuesta = completion.choices[0].message.content;

    // Guardar respuesta en historial
    historial.push({ role: 'assistant', content: respuesta });
    this.conversaciones.set(userId, historial);

    // Detectar intención
    const intencion = await this._detectarIntencion(mensaje);

    return { respuesta, intencion };
  }

  /**
   * Genera el resumen matutino del día
   */
  async generarResumenDiario(userId, datos) {
    const { correos, recordatorios, hora } = datos;
    const client = this._getClient();

    const prompt = `Eres Alma, la secretaria digital personal.
Genera un resumen matutino breve y cálido para Reyna.

Datos del día:
- Hora: ${hora || 'mañana'}
- Correos importantes: ${correos?.importantes || 0}
- Documentos por revisar: ${correos?.documentos || 0}
- Recordatorios hoy: ${recordatorios?.hoy || 0}

Responde con un saludo personalizado y el resumen.
Sé breve, cálida y profesional. Máximo 3 oraciones.`;

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: PERSONALIDAD_ALMA },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    return completion.choices[0].message.content;
  }

  /**
   * Detecta la intención del usuario
   */
  async _detectarIntencion(mensaje) {
    const client = this._getClient();

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Clasifica la intención del usuario en una de estas categorías:
- correos_revisar: quiere ver o revisar correos
- correos_archivar: quiere limpiar o archivar correos
- recordatorio_crear: quiere crear un recordatorio
- recordatorio_ver: quiere ver sus recordatorios
- saludo: es un saludo o conversación casual
- ayuda: necesita ayuda o tiene una pregunta
- resumen: quiere un resumen de su día
Responde SOLO con la categoría, sin explicación.`
        },
        { role: 'user', content: mensaje }
      ],
      temperature: 0,
      max_tokens: 30
    });

    return completion.choices[0].message.content.trim();
  }

  /**
   * Construye el contexto del sistema con información relevante
   */
  _construirContexto(contexto) {
    let sistemaMsg = PERSONALIDAD_ALMA;

    if (contexto.correos) {
      sistemaMsg += `\n\nCorreos del usuario:
- Importantes: ${contexto.correos.importantes || 0}
- Por revisar: ${contexto.correos.porRevisar || 0}
- Archivables: ${contexto.correos.archivables || 0}`;
    }

    if (contexto.recordatorios) {
      sistemaMsg += `\n\nRecordatorios para hoy: ${contexto.recordatorios.length || 0}`;
      if (contexto.recordatorios.length > 0) {
        sistemaMsg += '\n' + contexto.recordatorios
          .map(r => `- ${r.titulo} (${r.hora || 'sin hora'})`)
          .join('\n');
      }
    }

    return sistemaMsg;
  }

  /**
   * Limpia el historial de conversación de un usuario
   */
  limpiarHistorial(userId) {
    this.conversaciones.delete(userId);
  }
}

module.exports = new ConversacionService();
