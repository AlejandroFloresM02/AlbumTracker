const express = require('express');
const User = require('../models/user.model');
const router = express.Router();
const userController = require("../controllers/user.controllers");


const{
    registerUser,
    loginUser,
    deleteUser
} = require("../controllers/user.controllers");

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.delete('/delete', userController.deleteUser); 

module.exports = router;