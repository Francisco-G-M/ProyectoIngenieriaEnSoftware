const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../database.sqlite');

class Equipo {
  constructor({ id, nombre, categoria, stockDisponible }) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.stockDisponible = stockDisponible;
  }

  // Método estático exacto que llama ValidationService: Equipo.getByIds(solicitud.equipos)
  static getByIds(ids) {
    return new Promise((resolve, reject) => {
      if (!ids || ids.length === 0) return resolve([]);
      const db = new sqlite3.Database(dbPath);
      
      // Si llegan IDs repetidos (ej: [1, 1]), obtenemos de la BD cada elemento
      const placeholders = ids.map(() => '?').join(',');
      db.all(`SELECT id, nombre, categoria, stockDisponible FROM equipos WHERE id IN (${placeholders})`, ids, (err, rows) => {
        db.close();
        if (err) return reject(err);
        
        // Mapear cada ID recibido a su objeto correspondiente (preservando duplicados si los hay)
        const equiposEncontrados = ids.map(id => {
          const row = rows.find(r => r.id === Number(id));
          return row ? new Equipo(row) : null;
        }).filter(Boolean);

        resolve(equiposEncontrados);
      });
    });
  }

  // Método estático exacto que llama ValidationService: Equipo.checkStock(solicitud.equipos)
  static checkStock(ids) {
    return new Promise((resolve, reject) => {
      if (!ids || ids.length === 0) return resolve(true);
      const db = new sqlite3.Database(dbPath);
      
      // Contar cuántos de cada ID se solicitaron
      const conteo = {};
      ids.forEach(id => { conteo[id] = (conteo[id] || 0) + 1; });

      const uniqueIds = Object.keys(conteo);
      const placeholders = uniqueIds.map(() => '?').join(',');

      db.all(`SELECT id, stockDisponible FROM equipos WHERE id IN (${placeholders})`, uniqueIds, (err, rows) => {
        db.close();
        if (err) return reject(err);

        // Verificar que el stock disponible sea >= a lo pedido para cada ID
        for (const id of uniqueIds) {
          const row = rows.find(r => r.id === Number(id));
          if (!row || row.stockDisponible < conteo[id]) {
            return resolve(false);
          }
        }
        resolve(true);
      });
    });
  }
}

module.exports = Equipo;