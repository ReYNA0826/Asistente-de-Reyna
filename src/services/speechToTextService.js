/**
 * Speech-to-Text Service - Alma escucha
 *
 * Convierte la voz del usuario en texto usando OpenAI Whisper.
 * Flujo: Usuario habla → Whisper transcribe → Alma interpreta
 */

const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const os = require('os');

class SpeechToTextService {
  constructor() {
    this.openai = null;
  }

  _getClient() {
    if (!this.openai) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return this.openai;
  }

  /**
   * Transcribe un archivo de audio a texto
   * @param {Buffer} audioBuffer - Audio en formato webm, mp3, wav, etc.
   * @param {string} formato - Extensión del archivo (webm, mp3, wav)
   * @returns {string} Texto transcrito
   */
  async transcribir(audioBuffer, formato = 'webm') {
    const client = this._getClient();

    // Escribir buffer a archivo temporal
    const tmpFile = path.join(os.tmpdir(), `alma-audio-${Date.now()}.${formato}`);
    fs.writeFileSync(tmpFile, audioBuffer);

    try {
      const transcription = await client.audio.transcriptions.create({
        file: fs.createReadStream(tmpFile),
        model: 'whisper-1',
        language: 'es',
        response_format: 'text'
      });

      return transcription;
    } finally {
      // Limpiar archivo temporal
      if (fs.existsSync(tmpFile)) {
        fs.unlinkSync(tmpFile);
      }
    }
  }
}

module.exports = new SpeechToTextService();
