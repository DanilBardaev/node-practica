const User = require("../models/user");
const validator = require("validator");
const link = "https://kappa.lol/VMimi";
const messanger = "https://kappa.lol/iSONv";
exports.form = (req, res) => {
  res.render("loginForm", { title: "Login", link: link, messanger: messanger });
};

exports.submit = (req, res, next) => {
  const email = req.body.loginForm.email;
  const password = req.body.loginForm.password;
  if (!validator.isEmail(email)) {
    const errors = {
      email: {
        msg2: "*Неверный формат адреса электронной почты. example@gmail.com",
      },
    };
    return res.render("loginForm", {
      errors,
      link: link,
      messanger: messanger,
    });
  }
  if (password.length < 8) {
    const errors = {
      password: {
        msg: "*Пароль должен содержать не менее 8 символов. Или он неверный.",
      },
    };
    return res.render("loginForm", {
      errors,
      link: link,
      messanger: messanger,
    });
  }
  User.authenticate(req.body.loginForm, (error, data) => {
    if (error) return next(error);
    if (!data) {
      res.error("Имя или пароль неверный");
      error.statusCode = 401;
      return next(error);
    }

    req.session.userEmail = data.email;
    req.session.userName = data.name;
    res.redirect("/");
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};
