const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

const { registerUser, loginUser, deleteUser } = require("../controllers/user.controllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/delete", authMiddleware, deleteUser); 

module.exports = router;