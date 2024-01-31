const sqlite3 = require('sqlite3').verbose();

// Ruta y nombre del archivo de la base de datos
const dbPath = './src/database/Info.db';

// Crear una nueva instancia de la base de datos SQLite
const db = new sqlite3.Database(dbPath ,(err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos SQLite');
  }
});



module.exports = db;