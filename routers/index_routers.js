const express = require("express");
const router = express.Router();
const register = require("../controllers/register");
const login = require("../controllers/login");
const entries = require("../controllers/entries");

router.get("/", entries.list);

router.get("/post", entries.form);
router.post("/post", entries.submit);

router.get("/register", register.form);
router.post("/register", register.submit);

router.get("/login", login.form);
router.post("/login", login.submit);

router.get("/delete/:id", entries.delete);
// router.get("/edit/:id", entries.editForm);
// router.post("/edit/:id", entries.update);

router.get("/logout", login.logout);
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  })
  
module.exports = router;
