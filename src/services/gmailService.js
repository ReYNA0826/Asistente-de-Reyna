/**
 * Gmail Service - Gestión de correos para Alma
 *
 * Conecta con Gmail para:
 * - Leer correos importantes
 * - Clasificar correos (importantes, archivables, documentos)
 * - Archivar correos promocionales
 */

const { google } = require('googleapis');

class GmailService {
  constructor() {
    this.oauth2Client = null;
  }

  /**
   * Inicializa el cliente OAuth2 para Gmail
   */
  _getOAuth2Client() {
    if (!this.oauth2Client) {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
    }
    return this.oauth2Client;
  }

  /**
   * Genera la URL de autorización para que el usuario conecte Gmail
   */
  generarUrlAutorizacion() {
    const oauth2Client = this._getOAuth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify'
      ]
    });
  }

  /**
   * Intercambia el código de autorización por tokens
   */
  async autenticar(code) {
    const oauth2Client = this._getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
  }

  /**
   * Configura tokens existentes
   */
  configurarTokens(tokens) {
    const oauth2Client = this._getOAuth2Client();
    oauth2Client.setCredentials(tokens);
  }

  /**
   * Obtiene los correos importantes (requiere respuesta, clientes, documentos)
   * @param {number} maxResultados - Cantidad máxima de correos
   * @returns {Array} Lista de correos clasificados
   */
  async obtenerCorreosImportantes(maxResultados = 10) {
    const gmail = google.gmail({ version: 'v1', auth: this._getOAuth2Client() });

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: maxResultados,
      q: 'is:unread is:important',
      labelIds: ['INBOX']
    });

    const mensajes = response.data.messages || [];
    const correos = [];

    for (const msg of mensajes) {
      const detalle = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'metadata',
        metadataHeaders: ['From', 'Subject', 'Date']
      });

      const headers = detalle.data.payload.headers;
      correos.push({
        id: msg.id,
        de: this._getHeader(headers, 'From'),
        asunto: this._getHeader(headers, 'Subject'),
        fecha: this._getHeader(headers, 'Date'),
        snippet: detalle.data.snippet,
        etiquetas: detalle.data.labelIds
      });
    }

    return correos;
  }

  /**
   * Obtiene correos que se pueden archivar (promociones, newsletters)
   */
  async obtenerCorreosArchivables(maxResultados = 20) {
    const gmail = google.gmail({ version: 'v1', auth: this._getOAuth2Client() });

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: maxResultados,
      labelIds: ['CATEGORY_PROMOTIONS']
    });

    const mensajes = response.data.messages || [];
    const correos = [];

    for (const msg of mensajes) {
      const detalle = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'metadata',
        metadataHeaders: ['From', 'Subject']
      });

      const headers = detalle.data.payload.headers;
      correos.push({
        id: msg.id,
        de: this._getHeader(headers, 'From'),
        asunto: this._getHeader(headers, 'Subject'),
        tipo: 'promocional'
      });
    }

    return correos;
  }

  /**
   * Archiva una lista de correos
   * @param {string[]} ids - IDs de correos a archivar
   */
  async archivarCorreos(ids) {
    const gmail = google.gmail({ version: 'v1', auth: this._getOAuth2Client() });

    const resultados = [];
    for (const id of ids) {
      await gmail.users.messages.modify({
        userId: 'me',
        id: id,
        requestBody: {
          removeLabelIds: ['INBOX']
        }
      });
      resultados.push({ id, archivado: true });
    }

    return resultados;
  }

  /**
   * Resumen rápido del buzón
   */
  async obtenerResumen() {
    const gmail = google.gmail({ version: 'v1', auth: this._getOAuth2Client() });

    const [importantes, promociones, noLeidos] = await Promise.all([
      gmail.users.messages.list({
        userId: 'me', maxResults: 1, q: 'is:unread is:important'
      }).then(r => r.data.resultSizeEstimate || 0),

      gmail.users.messages.list({
        userId: 'me', maxResults: 1, labelIds: ['CATEGORY_PROMOTIONS'], q: 'is:unread'
      }).then(r => r.data.resultSizeEstimate || 0),

      gmail.users.messages.list({
        userId: 'me', maxResults: 1, q: 'is:unread'
      }).then(r => r.data.resultSizeEstimate || 0)
    ]);

    return {
      importantes,
      promociones,
      noLeidos,
      documentosPorRevisar: 0 // se expandirá con detección de adjuntos
    };
  }

  _getHeader(headers, name) {
    const header = headers.find(h => h.name === name);
    return header ? header.value : '';
  }
}

module.exports = new GmailService();
