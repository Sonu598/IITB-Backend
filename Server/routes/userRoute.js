const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../models/usermodel");
const { DeletedUserModel } = require("../models/deleteduser");
const { authenticate } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

userRouter.post("/register", async (req, res) => {
  try {
    const user = new UserModel(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).send("Invalid username or password/.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid username or password.");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send(token);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/all", authenticate("LIBRARIAN"), async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.patch("/user/:id", authenticate("LIBRARIAN"), async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.delete("/:id", authenticate("LIBRARIAN"), async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    const deletedUser = new DeletedUserModel(user);
    deletedUser.save();
    res.send(user).status(200);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/deleted", authenticate("LIBRARIAN"), async (req, res) => {
  try {
    const deletedUsers = await DeletedUserModel.find();
    res.send(deletedUsers);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = { userRouter };
