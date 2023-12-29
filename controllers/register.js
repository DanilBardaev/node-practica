const User = require("../models/user");
const validator = require("validator");

exports.form = (req, res) => {
  res.render("registerForm", { errors: {} });
};

exports.submit = (req, res, next) => {
  const { email, password } = req.body;


  if (password.length < 8) {
    const errors = {
      password: {
        msg: 'Пароль должен содержать не менее 8 символов.'
      }
    };
    return res.render("registerForm", { errors });
  }

  // Проверка валидности введенного адреса электронной почты
  if (!validator.isEmail(email)) {
    const errors = {
      email: {
        msg2: '*Неверный формат адреса электронной почты. example@gmail.com'
      }
    };
    return res.render("registerForm", { errors });
  }

  User.findByEmail(email, (error, user) => {
    if (error) return next(error);
    if (user) {
      console.log("Такой пользователь в базе уже существует.");
      res.redirect("/");
    } else {
      User.create(req.body, (err) => {
        if (err) return next(err);
        req.session.userEmail = email;
        req.session.userName = req.body.name;
        res.redirect("/");
      });
    }
  });
};
