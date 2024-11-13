const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const { emit } = require("nodemon");
const { use } = require("../routes/album.routes.js");

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

async function  findUser(user, email){
    const existingUser = await user.findOne({
        $or: [{username},{email}]
    });

    if(!existingUser){
        return "User not found. Please enter valid username or email."
    }



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

    //use find user function TODO
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email alredy in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch {
    console.error("Registration error", error.message);
    res.status(500).json({ error:"An error occured registering the user." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, email, password} = req.body;
    const existingUser = await User.findOne({
        $or:[{username},{email}]
    });

    if (!existingUser){
        return res.status(400).json({ error: "User not found. Please enter valid username or email."})
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if(!isPasswordCorrect){
        return res.status(400).json({error: "Invalid password. Please try again."});
    }
  } catch(error){
    console.error("Login error:",error.message);
    res.status(400).json({error:"An error occured during login."});
  }
};

const deleteUser = async(req, res) => {
    try{
        
    }catch(error){
        console.error('Delete error', error.message);
        res.status(400).json({error: "An error occured deleting the user"});
    }
}

module.exports = {
  registerUser,
  loginUser,
};
