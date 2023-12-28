const User = require("../models/user");

exports.form = (req, res) => {
  res.render("registerForm", { errors: {} });
};

exports.submit = (req, res, next) => {
  if (req.body.password.length < 8) {
    const errors = {
      password: {
        msg: '*Пароль должен содержать не менее 8 символов.'
      }
    };
    return res.render("registerForm", { errors });
  }

  User.findByEmail(req.body.email, (error, user) => {
    if (error) return next(error);
    if (user) {
      console.log("Такой пользователь в базе уже существует");
      res.redirect("/");
    } else {
      User.create(req.body, (err) => {
        if (err) return next(err);
        req.session.userEmail = req.body.email;
        req.session.userName = req.body.name;
        res.redirect("/");
      });
    }
  });
};
