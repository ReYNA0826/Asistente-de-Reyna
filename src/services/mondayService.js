/**
 * Servicio Monday.com - CRM e integracion de tareas
 *
 * Permite a Alma consultar y gestionar tableros, items y contactos en Monday.com
 */

const MONDAY_API = 'https://api.monday.com/v2';

class MondayService {
  constructor() {
    this.token = process.env.MONDAY_API_TOKEN;
  }

  get configurado() {
    return !!this.token;
  }

  /**
   * Ejecuta una query GraphQL en Monday.com
   */
  async query(gql, variables = {}) {
    if (!this.token) {
      throw new Error('Monday.com no esta configurado. Agrega MONDAY_API_TOKEN en .env');
    }

    const res = await fetch(MONDAY_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token,
        'API-Version': '2024-10'
      },
      body: JSON.stringify({ query: gql, variables })
    });

    if (!res.ok) {
      throw new Error(`Monday.com API error: ${res.status}`);
    }

    const data = await res.json();

    if (data.errors && data.errors.length > 0) {
      throw new Error(`Monday.com: ${data.errors[0].message}`);
    }

    return data.data;
  }

  /**
   * Obtiene todos los tableros del usuario
   */
  async obtenerTableros() {
    const data = await this.query(`
      query {
        boards(limit: 20) {
          id
          name
          description
          state
          columns { id title type }
          groups { id title }
          items_count
        }
      }
    `);
    return data.boards || [];
  }

  /**
   * Obtiene items de un tablero especifico
   */
  async obtenerItems(boardId, limit = 20) {
    const data = await this.query(`
      query($boardId: [ID!]!) {
        boards(ids: $boardId) {
          items_page(limit: ${limit}) {
            items {
              id
              name
              state
              created_at
              updated_at
              group { id title }
              column_values {
                id
                text
                type
                value
              }
            }
          }
        }
      }
    `, { boardId: [String(boardId)] });

    return data.boards?.[0]?.items_page?.items || [];
  }

  /**
   * Crea un item en un tablero
   */
  async crearItem(boardId, nombre, columnValues = {}) {
    const data = await this.query(`
      mutation($boardId: ID!, $itemName: String!, $columnValues: JSON) {
        create_item(
          board_id: $boardId,
          item_name: $itemName,
          column_values: $columnValues
        ) {
          id
          name
        }
      }
    `, {
      boardId: String(boardId),
      itemName: nombre,
      columnValues: JSON.stringify(columnValues)
    });

    return data.create_item;
  }

  /**
   * Actualiza un item
   */
  async actualizarItem(boardId, itemId, columnValues) {
    const data = await this.query(`
      mutation($boardId: ID!, $itemId: ID!, $columnValues: JSON!) {
        change_multiple_column_values(
          board_id: $boardId,
          item_id: $itemId,
          column_values: $columnValues
        ) {
          id
          name
        }
      }
    `, {
      boardId: String(boardId),
      itemId: String(itemId),
      columnValues: JSON.stringify(columnValues)
    });

    return data.change_multiple_column_values;
  }

  /**
   * Buscar items por nombre en todos los tableros
   */
  async buscarItems(texto, limit = 10) {
    const data = await this.query(`
      query($texto: String!) {
        items_page_by_column_values(
          limit: ${limit},
          board_id: 0,
          columns: [{column_id: "name", column_values: [$texto]}]
        ) {
          items {
            id
            name
            board { id name }
            group { title }
            column_values { id text type }
          }
        }
      }
    `, { texto });

    return data.items_page_by_column_values?.items || [];
  }

  /**
   * Obtiene resumen de tableros para contexto de Alma
   */
  async obtenerResumen() {
    try {
      const tableros = await this.obtenerTableros();
      return {
        totalTableros: tableros.length,
        tableros: tableros.map(t => ({
          id: t.id,
          nombre: t.name,
          items: t.items_count
        }))
      };
    } catch (e) {
      return { error: e.message, totalTableros: 0, tableros: [] };
    }
  }
}

module.exports = new MondayService();
