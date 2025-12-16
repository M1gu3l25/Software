// src/backend/routes/contactoRoutes.js
"use strict";

const express = require("express");
const router = express.Router();
const pool = require("../db");

// =======================================
// POST /api/contacto
// Guarda un mensaje de contacto
// Body:
// {
//   nombre_completo, correo_electronico,
//   telefono (opcional), mensaje
// }
// =======================================
router.post("/", async (req, res) => {
  try {
    const { nombre_completo, correo_electronico, telefono, mensaje } = req.body;

    // Validaciones mínimas (según tu tabla)
    if (!nombre_completo || !correo_electronico || !mensaje) {
      return res.status(400).json({
        error: "nombre_completo, correo_electronico y mensaje son obligatorios",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO contacto_mensajes
        (nombre_completo, correo_electronico, telefono, mensaje)
       VALUES (?, ?, ?, ?)`,
      [
        nombre_completo.trim(),
        correo_electronico.trim(),
        telefono?.trim() || null,
        mensaje.trim(),
      ]
    );

    return res.status(201).json({
      message: "Mensaje enviado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al guardar contacto:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// (Opcional) GET /api/contacto  (para admin, si lo ocupas después)
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM contacto_mensajes ORDER BY creado_en DESC, id DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar contacto_mensajes:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
