const User = require("../models/user");

exports.form = (req, res) => {
    res.render("registerForm", { title: "Register" });
};

exports.submit = async (req, res, next) => {
  try {
      // Проверка, что все необходимые данные предоставлены
      if (!req.body.email || !req.body.password) {
          throw new Error("Необходимы email и пароль");
      }

      // Проверка, существует ли уже пользователь с таким email
      const existingUser = await User.findByEmail(req.body.email);
      if (existingUser) {
          throw new Error("Пользователь с таким email уже существует");
      }

      // Создание нового пользователя
      await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          age: req.body.age // предположим, что возраст также передается
      });

      // Аутентификация (вход) пользователя после регистрации
      const newUser = await User.authentificate({
          email: req.body.email,
          password: req.body.password
      });

      // Установка данных пользователя в сессию
      req.session.userEmail = newUser.email;
      req.session.userName = newUser.name;

      // Перенаправление пользователя на главную страницу
      res.redirect('/');

  } catch (error) {
      // Логирование ошибки и вывод сообщения об ошибке
      console.error("Ошибка при регистрации:", error.message);
      res.status(500).send("Ошибка при регистрации: " + error.message);
  }
};