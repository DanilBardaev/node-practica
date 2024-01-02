const Entry = require("../models/entry");
const multer = require("multer");
const link = "https://kappa.lol/VMimi";
const messanger = "https://kappa.lol/iSONv";
const path = require("path");
const express = require("express");
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

exports.delete = (req, res, next) => {
  const postId = req.params.id;
  Entry.delete(postId, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

exports.list = (req, res, next) => {
  Entry.selectAll((err, entries) => {
    if (err) return next(err);
    res.render("entries", { title: "Entries", entries: entries, link: link});
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
      console.log(entry.imagePath);
    } catch (err) {
      return next(err);
    }
  },
];

exports.updateForm = (req, res) => {
  const id = req.params.id;
  Entry.getEntryId(id, (err, entry) => {
    if (err) {
      return res.redirect("/");
    }
    res.render("edit", { title: "Форма изменения поста", entry: entry, link: link, messanger: messanger});
  });
};

exports.updateSubmit = [
  upload.single("entryImage"),
  (req, res, next) => {
    const id = req.params.id;
    const newData = {
      title: req.body.entry.title,
      content: req.body.entry.content,
      imagePath: req.file ? req.file.path : null,
    };
    Entry.update(id, newData, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
];
