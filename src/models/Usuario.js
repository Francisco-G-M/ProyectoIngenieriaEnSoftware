const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../database.sqlite');

class Usuario {
  constructor({ id, nombre, rol, enListaNegra }) {
    this.id = id;
    this.nombre = nombre;
    this.rol = rol;
    this.enListaNegra = enListaNegra === 1 || enListaNegra === true;
  }

  // Método estático exacto que llama ValidationService: Usuario.estaSancionado(solicitud.estudianteId)
  static estaSancionado(id) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);
      db.get(`SELECT enListaNegra FROM usuarios WHERE id = ?`, [id], (err, row) => {
        db.close();
        if (err) return reject(err);
        if (!row) return resolve(false);
        resolve(row.enListaNegra === 1 || row.enListaNegra === true);
      });
    });
  }

  static obtenerPorId(id) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);
      db.get(`SELECT id, nombre, rol, enListaNegra FROM usuarios WHERE id = ?`, [id], (err, row) => {
        db.close();
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(new Usuario(row));
      });
    });
  }
}

module.exports = Usuario;
