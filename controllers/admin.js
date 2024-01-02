const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Маршрут для отображения панели администратора
router.get("/admin/users", (req, res) => {
    if (!req.session.isAdmin) {
      return res.redirect("/login");
    }
  
    User.getAllUsers((err, users) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Внутренняя ошибка сервера");
      }
  
      res.render("admin/users", { users });
    });
  });
  

// Маршрут для отображения списка пользователей администратору
router.get("/admin/users", (req, res) => {
  // Проверяем, авторизован ли пользователь как администратор
  if (!req.session.isAdmin) {
    return res.redirect("/login");
  }

  // Получаем список пользователей из базы данных
  User.find({}, (err, users) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Внутренняя ошибка сервера");
    }

    // Отображаем список пользователей администратору
    res.render("admin/users", { users });
  });
});

// Маршрут для удаления пользователя администратором
router.post("/admin/users/:id/delete", (req, res) => {
  // Проверяем, авторизован ли пользователь как администратор
  if (!req.session.isAdmin) {
    return res.redirect("/login");
  }

  const userId = req.params.id;

  // Удаляем пользователя из базы данных
  User.findByIdAndRemove(userId, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Внутренняя ошибка сервера");
    }

    res.redirect("/admin/users");
  });
});

module.exports = router;
