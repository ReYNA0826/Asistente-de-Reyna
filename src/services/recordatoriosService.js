/**
 * Servicio de Recordatorios - Alma recuerda por ti
 *
 * Gestiona recordatorios por voz o texto.
 * Almacenamiento en memoria (futuro: base de datos persistente)
 */

const { v4: uuidv4 } = require('uuid');

class RecordatoriosService {
  constructor() {
    // Almacenamiento en memoria (por usuario)
    this.recordatorios = new Map();
  }

  /**
   * Crea un nuevo recordatorio
   * @param {string} userId
   * @param {object} datos - { titulo, descripcion, fecha, hora, prioridad }
   */
  crear(userId, datos) {
    const lista = this.recordatorios.get(userId) || [];

    const recordatorio = {
      id: uuidv4(),
      titulo: datos.titulo,
      descripcion: datos.descripcion || '',
      fecha: datos.fecha || new Date().toISOString().split('T')[0],
      hora: datos.hora || null,
      prioridad: datos.prioridad || 'normal', // alta, normal, baja
      completado: false,
      creadoEn: new Date().toISOString()
    };

    lista.push(recordatorio);
    this.recordatorios.set(userId, lista);

    return recordatorio;
  }

  /**
   * Obtiene recordatorios del día
   */
  obtenerHoy(userId) {
    const hoy = new Date().toISOString().split('T')[0];
    const lista = this.recordatorios.get(userId) || [];
    return lista.filter(r => r.fecha === hoy && !r.completado);
  }

  /**
   * Obtiene recordatorios de mañana
   */
  obtenerManana(userId) {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const fechaManana = manana.toISOString().split('T')[0];
    const lista = this.recordatorios.get(userId) || [];
    return lista.filter(r => r.fecha === fechaManana && !r.completado);
  }

  /**
   * Obtiene todos los recordatorios de la semana
   */
  obtenerSemana(userId) {
    const hoy = new Date();
    const finSemana = new Date();
    finSemana.setDate(hoy.getDate() + 7);

    const lista = this.recordatorios.get(userId) || [];
    return lista.filter(r => {
      const fecha = new Date(r.fecha);
      return fecha >= hoy && fecha <= finSemana && !r.completado;
    });
  }

  /**
   * Marca un recordatorio como completado
   */
  completar(userId, recordatorioId) {
    const lista = this.recordatorios.get(userId) || [];
    const recordatorio = lista.find(r => r.id === recordatorioId);

    if (!recordatorio) {
      return null;
    }

    recordatorio.completado = true;
    recordatorio.completadoEn = new Date().toISOString();
    return recordatorio;
  }

  /**
   * Elimina un recordatorio
   */
  eliminar(userId, recordatorioId) {
    const lista = this.recordatorios.get(userId) || [];
    const index = lista.findIndex(r => r.id === recordatorioId);

    if (index === -1) {
      return false;
    }

    lista.splice(index, 1);
    this.recordatorios.set(userId, lista);
    return true;
  }

  /**
   * Obtiene resumen para el contexto de Alma
   */
  obtenerResumen(userId) {
    const hoy = this.obtenerHoy(userId);
    const manana = this.obtenerManana(userId);
    const semana = this.obtenerSemana(userId);

    return {
      hoy: hoy.length,
      manana: manana.length,
      semana: semana.length,
      recordatoriosHoy: hoy
    };
  }
}

module.exports = new RecordatoriosService();
