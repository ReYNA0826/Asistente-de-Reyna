/**
 * Servicio de Recordatorios - Alma recuerda por ti
 *
 * Usa Supabase como base de datos persistente.
 * Fallback a almacenamiento en memoria si Supabase no esta disponible.
 */

const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/supabase');

class RecordatoriosService {
  constructor() {
    // Fallback en memoria si no hay Supabase
    this.memoriaLocal = new Map();
    this.usarSupabase = !!supabase;
  }

  /**
   * Crea un nuevo recordatorio
   */
  async crear(userId, datos) {
    const recordatorio = {
      id: uuidv4(),
      user_id: userId,
      titulo: datos.titulo,
      descripcion: datos.descripcion || '',
      fecha: datos.fecha || new Date().toISOString().split('T')[0],
      hora: datos.hora || null,
      prioridad: datos.prioridad || 'media',
      completado: false,
      creado_en: new Date().toISOString()
    };

    if (this.usarSupabase) {
      try {
        const { data, error } = await supabase
          .from('recordatorios')
          .insert(recordatorio)
          .select()
          .single();

        if (error) throw error;
        return this._formatear(data);
      } catch (e) {
        console.warn('[Recordatorios] Supabase error, usando memoria:', e.message);
        return this._crearEnMemoria(userId, recordatorio);
      }
    }

    return this._crearEnMemoria(userId, recordatorio);
  }

  _crearEnMemoria(userId, rec) {
    const lista = this.memoriaLocal.get(userId) || [];
    lista.push(rec);
    this.memoriaLocal.set(userId, lista);
    return this._formatear(rec);
  }

  /**
   * Obtiene recordatorios del dia
   */
  async obtenerHoy(userId) {
    const hoy = new Date().toISOString().split('T')[0];

    if (this.usarSupabase) {
      try {
        const { data, error } = await supabase
          .from('recordatorios')
          .select('*')
          .eq('user_id', userId)
          .eq('fecha', hoy)
          .eq('completado', false)
          .order('hora', { ascending: true });

        if (error) throw error;
        return (data || []).map(r => this._formatear(r));
      } catch (e) {
        console.warn('[Recordatorios] Fallback a memoria:', e.message);
      }
    }

    const lista = this.memoriaLocal.get(userId) || [];
    return lista.filter(r => r.fecha === hoy && !r.completado).map(r => this._formatear(r));
  }

  /**
   * Obtiene recordatorios de manana
   */
  async obtenerManana(userId) {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const fechaManana = manana.toISOString().split('T')[0];

    if (this.usarSupabase) {
      try {
        const { data, error } = await supabase
          .from('recordatorios')
          .select('*')
          .eq('user_id', userId)
          .eq('fecha', fechaManana)
          .eq('completado', false)
          .order('hora', { ascending: true });

        if (error) throw error;
        return (data || []).map(r => this._formatear(r));
      } catch (e) {
        console.warn('[Recordatorios] Fallback a memoria:', e.message);
      }
    }

    const lista = this.memoriaLocal.get(userId) || [];
    return lista.filter(r => r.fecha === fechaManana && !r.completado).map(r => this._formatear(r));
  }

  /**
   * Obtiene recordatorios de la semana
   */
  async obtenerSemana(userId) {
    const hoy = new Date().toISOString().split('T')[0];
    const fin = new Date();
    fin.setDate(fin.getDate() + 7);
    const fechaFin = fin.toISOString().split('T')[0];

    if (this.usarSupabase) {
      try {
        const { data, error } = await supabase
          .from('recordatorios')
          .select('*')
          .eq('user_id', userId)
          .gte('fecha', hoy)
          .lte('fecha', fechaFin)
          .eq('completado', false)
          .order('fecha', { ascending: true })
          .order('hora', { ascending: true });

        if (error) throw error;
        return (data || []).map(r => this._formatear(r));
      } catch (e) {
        console.warn('[Recordatorios] Fallback a memoria:', e.message);
      }
    }

    const lista = this.memoriaLocal.get(userId) || [];
    return lista.filter(r => {
      return r.fecha >= hoy && r.fecha <= fechaFin && !r.completado;
    }).map(r => this._formatear(r));
  }

  /**
   * Marca un recordatorio como completado
   */
  async completar(userId, recordatorioId) {
    if (this.usarSupabase) {
      try {
        const { data, error } = await supabase
          .from('recordatorios')
          .update({
            completado: true,
            completado_en: new Date().toISOString()
          })
          .eq('id', recordatorioId)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return this._formatear(data);
      } catch (e) {
        console.warn('[Recordatorios] Fallback a memoria:', e.message);
      }
    }

    const lista = this.memoriaLocal.get(userId) || [];
    const rec = lista.find(r => r.id === recordatorioId);
    if (!rec) return null;
    rec.completado = true;
    rec.completado_en = new Date().toISOString();
    return this._formatear(rec);
  }

  /**
   * Elimina un recordatorio
   */
  async eliminar(userId, recordatorioId) {
    if (this.usarSupabase) {
      try {
        const { error } = await supabase
          .from('recordatorios')
          .delete()
          .eq('id', recordatorioId)
          .eq('user_id', userId);

        if (error) throw error;
        return true;
      } catch (e) {
        console.warn('[Recordatorios] Fallback a memoria:', e.message);
      }
    }

    const lista = this.memoriaLocal.get(userId) || [];
    const index = lista.findIndex(r => r.id === recordatorioId);
    if (index === -1) return false;
    lista.splice(index, 1);
    this.memoriaLocal.set(userId, lista);
    return true;
  }

  /**
   * Obtiene resumen para el contexto de Alma
   */
  async obtenerResumen(userId) {
    const hoy = await this.obtenerHoy(userId);
    const manana = await this.obtenerManana(userId);
    const semana = await this.obtenerSemana(userId);

    return {
      hoy: hoy.length,
      manana: manana.length,
      semana: semana.length,
      recordatoriosHoy: hoy
    };
  }

  /**
   * Formatea un recordatorio de Supabase al formato de la app
   */
  _formatear(r) {
    return {
      id: r.id,
      titulo: r.titulo,
      descripcion: r.descripcion || '',
      fecha: r.fecha,
      hora: r.hora,
      prioridad: r.prioridad || 'media',
      completado: r.completado || false,
      creadoEn: r.creado_en || r.creadoEn
    };
  }
}

module.exports = new RecordatoriosService();
