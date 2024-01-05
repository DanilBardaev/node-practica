const User = require("../models/user");
const { validateEmail, validatePassword } = require("../middleware/validation");
const link = "https://kappa.lol/VMimi";
const messanger = "https://kappa.lol/iSONv";

exports.form = (req, res) => {
  res.render("registerForm", { errors: {}, link: link, messanger: messanger });
};

exports.submit = (req, res, next) => {
  const { name, email, age, password } = req.body;

  if (!validateEmail(email)) {
    return res.render("registerForm", {
      errors: { email: { msg2: "*Некорректная форма email.Пример example@gmail.com" } },link: link,messanger: messanger });
  }

  if (!validatePassword(password)) {
    return res.render("registerForm", {
      errors: { password: { msg: "*Пароль должен содержать минимум 8 символов и одну заглавную букву" } }, link: link, messanger: messanger
    });
  }

  User.findByEmail(email, (error, user) => {
    if (error) return next(error);
    if (user) {
      console.log("Такой пользователь в базе уже существует.");
      return res.redirect("/");
    } else {
      User.create(req.body, (err) => {
        if (err) return next(err);
        req.session.userEmail = email;
        req.session.userName = name;
        return res.redirect("/");
      });
    }
  });
};
