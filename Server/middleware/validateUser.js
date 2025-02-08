const { UserModel } = require("../models/usermodel");

const validateUser = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { validateUser };
