const express = require("express");
const { register } = require("../controllers/register.controller");
const { login } = require("../controllers/login.controller");
const { refresh } = require("../controllers/refresh.controller");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/jwt.util");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refresh);

module.exports = router;
