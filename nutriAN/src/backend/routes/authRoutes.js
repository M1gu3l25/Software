// src/backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();

const {
  login,
  register,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// Login
router.post("/login", login);

// Crear cuenta
router.post("/register", register);

// Olvidé mi contraseña (envía correo)
router.post("/forgot-password", forgotPassword);

// Reset contraseña (recibe token y nueva password)
router.post("/reset-password", resetPassword);

module.exports = router;
