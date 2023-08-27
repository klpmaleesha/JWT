const {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt.util");
const User = require("../models/Users.model");

exports.refresh = async (req, res) => {
  const currentRefreshToken = req.cookies.refreshToken;
  if (!currentRefreshToken) {
    return res.sendStatus(401);
  }
  try {
    const decoded = verifyToken(
      currentRefreshToken,
      process.env.REFRESHTOKEN_SECRET
    );
    const user = await User.findOne({ email: decoded.userEmail });

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user.email);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.send(error);
  }
};
