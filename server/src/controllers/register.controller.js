const bcrypt = require("bcrypt");
const User = require("../models/Users.model");
const { registrationSchema } = require("../validations/register.validation");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt.util");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    try {
      await registrationSchema.validate({ name, email, password });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const hash = await bcrypt.hash(password, 10);
    const refreshToken = await generateRefreshToken(email);
    const createdUser = await User.create({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      password: hash,
      refreshToken,
    });
    const accessToken = await generateAccessToken(createdUser._id);

    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    return res.status(200).send({
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Register Failed" });
  }
};
