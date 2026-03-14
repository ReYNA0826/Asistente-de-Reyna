/**
 * ElevenLabs Voice Service - La voz de Alma
 *
 * Convierte texto en voz femenina natural, cálida y profesional.
 * Flujo: IA genera respuesta → ElevenLabs la convierte en audio → Alma habla
 */

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.voiceId = process.env.ELEVENLABS_VOICE_ID;
  }

  /**
   * Convierte texto en audio con la voz de Alma
   * @param {string} texto - El texto que Alma va a decir
   * @param {object} opciones - Configuración de voz
   * @returns {Buffer} Audio en formato mp3
   */
  async textoAVoz(texto, opciones = {}) {
    if (!this.apiKey) {
      throw new Error('ELEVENLABS_API_KEY no configurada');
    }

    const {
      estabilidad = 0.5,       // Balance entre variación y consistencia
      similaridad = 0.75,      // Qué tanto se parece a la voz original
      estilo = 0.3,            // Expresividad del estilo
      usarAltavoz = true       // Mejora de altavoz
    } = opciones;

    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${this.voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: texto,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: estabilidad,
            similarity_boost: similaridad,
            style: estilo,
            use_speaker_boost: usarAltavoz
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs error: ${response.status} - ${error}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Convierte texto en audio con streaming (baja latencia)
   * Ideal para conversación en tiempo real
   */
  async textoAVozStream(texto, opciones = {}) {
    if (!this.apiKey) {
      throw new Error('ELEVENLABS_API_KEY no configurada');
    }

    const {
      estabilidad = 0.5,
      similaridad = 0.75,
      estilo = 0.3
    } = opciones;

    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${this.voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: texto,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: estabilidad,
            similarity_boost: similaridad,
            style: estilo
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs stream error: ${response.status} - ${error}`);
    }

    return response.body;
  }

  /**
   * Lista las voces disponibles en la cuenta
   */
  async listarVoces() {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: { 'xi-api-key': this.apiKey }
    });

    if (!response.ok) {
      throw new Error(`Error al listar voces: ${response.status}`);
    }

    const data = await response.json();
    return data.voices;
  }
}

module.exports = new ElevenLabsService();
