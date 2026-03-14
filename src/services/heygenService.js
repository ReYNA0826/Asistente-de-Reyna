/**
 * HeyGen Avatar Service - El avatar visual de Alma
 *
 * Genera videos de avatar parlante usando HeyGen API.
 * Flujo: IA genera respuesta → HeyGen crea video con avatar hablando → Video para el usuario
 */

const HEYGEN_API_URL = 'https://api.heygen.com';

class HeyGenService {
  constructor() {
    this.apiKey = process.env.HEYGEN_API_KEY;
  }

  /**
   * Genera un video del avatar hablando el texto dado
   * @param {string} texto - Lo que Alma va a decir
   * @param {object} opciones - Configuración del video
   * @returns {object} Datos del video generado (video_id, status)
   */
  async generarVideo(texto, opciones = {}) {
    if (!this.apiKey) {
      throw new Error('HEYGEN_API_KEY no configurada');
    }

    const {
      avatarId = process.env.HEYGEN_AVATAR_ID || 'default',
      voiceId = process.env.ELEVENLABS_VOICE_ID,
      fondo = '#FFFFFF',
      calidad = 'medium'
    } = opciones;

    const response = await fetch(`${HEYGEN_API_URL}/v2/video/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey
      },
      body: JSON.stringify({
        video_inputs: [{
          character: {
            type: 'avatar',
            avatar_id: avatarId,
            avatar_style: 'normal'
          },
          voice: {
            type: 'text',
            input_text: texto,
            voice_id: voiceId
          },
          background: {
            type: 'color',
            value: fondo
          }
        }],
        dimension: { width: 1280, height: 720 },
        test: process.env.NODE_ENV !== 'production'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HeyGen error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Consulta el estado de un video en proceso
   * @param {string} videoId - ID del video
   * @returns {object} Estado y URL del video si está listo
   */
  async estadoVideo(videoId) {
    if (!this.apiKey) {
      throw new Error('HEYGEN_API_KEY no configurada');
    }

    const response = await fetch(
      `${HEYGEN_API_URL}/v1/video_status.get?video_id=${videoId}`,
      {
        headers: { 'X-Api-Key': this.apiKey }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HeyGen status error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Lista los avatares disponibles en la cuenta
   * @returns {Array} Lista de avatares
   */
  async listarAvatares() {
    if (!this.apiKey) {
      throw new Error('HEYGEN_API_KEY no configurada');
    }

    const response = await fetch(`${HEYGEN_API_URL}/v2/avatars`, {
      headers: { 'X-Api-Key': this.apiKey }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HeyGen avatars error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.data.avatars;
  }
}

module.exports = new HeyGenService();
