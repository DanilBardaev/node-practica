const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("test.sqlite");

const sql =
  "CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, title TEXT, content TEXT NOT NULL, imagePath TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)";


db.run(sql);

class Entry {
  constructor() {}

  static create(data) {
    const sql = "INSERT INTO entries (username, title, content, imagePath, timestamp) VALUES (?,?,?,?, datetime('now'))";
    
    db.run(sql, data.username, data.title, data.content, data.imagePath);
  }
  static delete(id, cb) {
    const sql = "DELETE FROM entries WHERE id = ?";
    db.run(sql, id, cb);
  }
  static getById(id, cb) {
  const sql = "SELECT * FROM entries WHERE id = ?";
  db.get(sql, id, cb);
}

  static selectAll(cb) {
    db.all("SELECT * FROM entries", cb);
  }
}

module.exports = Entry;