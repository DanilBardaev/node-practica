const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("test.sqlite");
const multer = require("multer");
const storage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)); // Генерация уникального имени файла
  },
});


const upload = multer({ storage: storage });
const sql =
  "CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, title TEXT, content TEXT NOT NULL, imagePath TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)";


db.run(sql);

class Entry {
  constructor() {}

  static create(data) {
    const sql = "INSERT INTO entries (username, title, content, imagePath, timestamp) VALUES (?,?,?,?, datetime('now'))";
    
    db.run(sql, data.username, data.title, data.content, data.imagePath);
  }

  static selectAll(cb) {
    db.all("SELECT * FROM entries", cb);
  }

  static getEntryId(id, cb) {
    const sql = "SELECT * FROM entries WHERE id = ?";
    db.get(sql, id, cb);
  }

  static delete(id, cb) {
    const sql = "DELETE FROM entries WHERE id = ?";
    db.run(sql, id, cb);
  }
 
  static update(id, newData, cb) {
    const checkExistenceSql = "SELECT * FROM entries WHERE id = ?";
    db.get(checkExistenceSql, id, (err, row) => {
      if (err) {
        return cb(err);
      }

      if (!row) {
        return cb(new Error("Entry not found"));
      }

      const updateSql =
        "UPDATE entries SET title = ?, content = ?, imagePath = ? WHERE id = ?";
      db.run(updateSql, newData.title, newData.content, newData.imagePath, id, cb);
    });
  }
  }
 


module.exports = Entry;