const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Маршрут для отображения списка пользователей админу
router.get("/admin/users", (req, res) => {
  // Проверяем, авторизован ли пользователь как админ
  if (!req.session.isAdmin) {
    return res.redirect("/login");
  }
})  

// удаление поста пользователя админом
router.post("/admin/users/:id/delete", (req, res) => {
  // Проверка, авторизован ли пользователь как админ
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
