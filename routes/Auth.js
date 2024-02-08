const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../database/UserModal");
const { resFunc, generateToken } = require("../utility/Utility");
const saltRounds = 10;

//register api
router.route("/signup").post(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //Validation
    if (!username || !email || !password)
      throw new Error("ALL FIELDS REQUIRED");
    const exists = await User.findOne({ email: email });
    if (exists) throw new Error("User Already Exists");
    //if no user with the user name then creating new user
    const userData = new User({
      username,
      email,
      password: await bcrypt.hash(password, saltRounds),
    });
    const user = await userData.save();
    const message = {
      userInfo: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token: generateToken(user._id, user.username, user.email),
    };
    return res.status(200).json(resFunc(true, message));
  } catch (error) {
    return res.status(200).json(resFunc(false, error.message));
  }
});

//login api
router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    //Validation
    if (!email || !password) throw new Error("ALL FIELDS REQUIRED");
    //checking in data base if user exists or not
    const user = await User.findOne({ email: email });
    if (!user)
      throw new Error("User With that email Does Not Exists".toUpperCase());
    if (!(await bcrypt.compare(password, user.password)))
      throw new Error("PASSWORD DOES NOT MATCH");
    const message = {
      userInfo: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token: generateToken(user._id, user.username, user.email),
    };
    return res.status(200).json(resFunc(true, message));
  } catch (error) {
    return res.status(200).json(resFunc(false, error.message));
  }
});
module.exports = router;
