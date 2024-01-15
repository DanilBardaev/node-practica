function message(req) {
  return (msg, type) => {
    type = type || "error1";
    let sess = req.session;
    sess.message = sess.message || { err };
    sess.message.push({ type: type, string: msg });
  };
}

module.exports = function (req, res, next) {
  res.message = message(req);
  res.error = (msg) => {
    return res.message(msg, "error");
  };
  res.locals.message = req.session.message || [];
  res.locals.removeMessage = function () {
    req.session.message = [];
  };
  next();
};
