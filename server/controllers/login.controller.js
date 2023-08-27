const bcrypt = require("bcrypt");
const User = require("../models/Users.model");
const { loginSchema } = require("../validations/login.validation");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt.util");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    try {
      await loginSchema.validate({ email, password });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User Already Exists" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect Password" });
    }
    const refreshToken = await generateRefreshToken(email);

    const accessToken = await generateAccessToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    return res.status(200).json({
      user: { id: user._id, email: user.email, name: user.name },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
