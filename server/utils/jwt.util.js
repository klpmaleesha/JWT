const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, userEmail) => {
  return jwt.sign({ userId, userEmail }, process.env.ACCESSTOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userEmail) => {
  return jwt.sign({ userEmail }, process.env.REFRESHTOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
