exports.getField = (req, field) => {
  let value;
  field.forEach((element) => {
    value = req.body(element);
  });
  return value;
};
function parseField(field) {
  return field.split(/\[|\]/).filter((s) => s);
}
exports.required = (field) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, field)) {
      next();
    } else {
      res.error("Required field"); // Сообщение пользователю
      res.redirect("/back");
    }
  };
};

exports.lenghtAbove = (field, len) => {
  return (req, res, next) => {
    if (getField(req, field).length > len) {
      next();
    } else {
      res.error("Required field"); // Сообщение пользователю
      res.redirect("/back");
    }
  };
};
