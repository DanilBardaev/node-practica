const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const res = require("express/lib/response");
const db = new sqlite3.Database("test.sqlite");

const sql =
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, age INT NOT NULL)";

db.run(sql);

class User {
  constructor() {}
  static create(dataForm) {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(dataForm.password, salt);
            const sql = "INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?)";
            db.run(sql, [dataForm.name, dataForm.email, hash, dataForm.age], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        } catch (error) {
            reject(error);
        }
    });
}

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE email = ?", email, (error, user) => {
            if (error) reject(error);
            else resolve(user);
        });
    });
}

static authentificate(dataForm) {
  return new Promise((resolve, reject) => {
      User.findByEmail(dataForm.email).then(user => {
          if (!user) reject(new Error("Пользователь не найден"));

          bcrypt.compare(dataForm.password, user.password, (err, result) => {
              if (err) reject(err);
              else if (result) resolve(user);
              else reject(new Error("Неверный пароль"));
          });
      }).catch(error => {
          reject(error);
      });
  });
}
}

module.exports = User;
