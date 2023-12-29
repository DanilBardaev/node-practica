const User = require("../models/user");
const validator = require("validator");

exports.form = (req, res) => {
  res.render("loginForm", { title: "Login" });
};

exports.submit = (req, res, next) => {
  const email = req.body.loginForm.email;
  const password = req.body.loginForm.password;
  if (!validator.isEmail(email)) {
    const errors = {
      email: {
        msg2: '*Неверный формат адреса электронной почты. example@gmail.com'
      }
    };
    return res.render("loginForm", { errors });
  }
  if (password.length < 8) {
    const errors = {
      password: {
        msg: '*Пароль должен содержать не менее 8 символов. Или он неверный.'
      }
    };
    return res.render("loginForm", { errors });
  }
  User.authenticate(req.body.loginForm, (error, data) => {
    if (error) return next(error);
    if (!data) {
      const error = new Error("Имя или пароль неверный");
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
    res.redirect("/register");
  });
};
