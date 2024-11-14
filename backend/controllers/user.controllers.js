const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { use } = require("../routes/album.routes");
require("dotenv").config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

function validatePassword(password) {
  const COMMON_PASSWORDS = new Set([
    "password",
    "password123",
    "123456789",
    "1q2w3e4r",
    "aa12345678",
    "password01",
    "qwertyuiop",
    "888888",
  ]);

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return "Please choose a more secure password.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasNonAlphanum = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUppercase || !hasLowercase || hasNonAlphanum || hasNumber) {
    return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  return null;
}

function validateEmail(email) {
  emailRegex = /^[^ \s@]+@[^\s@]+\.[^s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  return null;
}

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const emailError = validateEmail(email);
    if (emailError) {
      return res.status(400).json({ error: emailError });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or username already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = generateToken(use._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch {
    console.error("Registration error", error.message);
    res.status(500).json({ error: "An error occured registering the user." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({
      $or: [{username},{email}]
    });
    
    const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid password. Please try again." });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username:user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).json({ error: "An error occured during login." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    const currUser = await User.findOne({
      $or: [{username},{email}]
    });

    if (!currUser) {
      return res.status(404).json({ error:"The user doesn't exists"});
    }

    await User.deleteOne({ $or: [{ username }, { email }] });
    res.status(200).json({ message: "User succesfully deleted" });
  } catch (error) {
    console.error("Delete error", error.message);
    res.status(400).json({ error: "An error occured deleting the user" });
  }
};

module.exports = {
    registerUser,
    loginUser,
    deleteUser
};