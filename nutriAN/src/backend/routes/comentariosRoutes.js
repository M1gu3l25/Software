// src/backend/routes/comentariosRoutes.js
"use strict";

const express = require("express");
const router = express.Router();

const {
  getComentarios,
  createComentario,
} = require("../controllers/comentariosController");

router.get("/", getComentarios);
router.post("/", createComentario);

module.exports = router;
