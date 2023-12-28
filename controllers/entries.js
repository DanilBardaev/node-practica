const Entry = require("../models/entry");
const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();
const storage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)); // Генерация уникального имени файла
  },
});


const upload = multer({ storage: storage });

exports.delete = (req, res, next) => {
  const postId = req.params.id;
  // Проверить, что текущий пользователь является автором поста
  // Если не является, вернуть ошибку или перенаправить на другую страницу
  // Иначе, удалить пост из базы данных
  Entry.delete(postId, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
exports.list = (req, res, next) => {
  Entry.selectAll((err, entries) => {
    if (err) return next(err);
    res.render("entries", { title: "Entries", entries: entries });
  });
};


exports.form = (req, res, next) => {
  res.render("post", { title: "Post" });
};



exports.submit = [
  upload.single("entryImage"),
  (req, res, next) => {
    try {
      const username = req.user ? req.user.name : null;
      const data = req.body.entry;

      if (!data.content) {
        throw new Error("Content is required");
      }
      const imagePath = req.file ? req.file.path : null; 
      const entry = {
        username: username,
        title: data.title,
        content: data.content,
        imagePath: imagePath,
      };
      Entry.create(entry);
      res.redirect("/");
      console.log(entry.imagePath)
    } catch (err) {
      return next(err);
    }
  },
];
