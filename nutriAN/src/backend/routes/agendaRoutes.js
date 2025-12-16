// src/backend/routes/agendaRoutes.js
"use strict";

const express = require("express");
const router = express.Router();
const pool = require("../db");

// =======================================
// POST /api/agenda-consulta
// Guarda una solicitud de consulta
// Body:
// {
//   nombre_completo, correo_electronico,
//   telefono (opcional), fecha_preferida, mensaje (opcional)
// }
// =======================================
router.post("/", async (req, res) => {
  try {
    const {
      nombre_completo,
      correo_electronico,
      telefono,
      fecha_preferida,
      mensaje,
    } = req.body;

    // Validaciones mínimas (según tu tabla)
    if (!nombre_completo || !correo_electronico || !fecha_preferida) {
      return res.status(400).json({
        error: "nombre_completo, correo_electronico y fecha_preferida son obligatorios",
      });
    }

    // Insert
    const [result] = await pool.query(
      `INSERT INTO agenda_consulta
        (nombre_completo, correo_electronico, telefono, fecha_preferida, mensaje)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nombre_completo.trim(),
        correo_electronico.trim(),
        telefono?.trim() || null,
        fecha_preferida,
        mensaje?.trim() || null,
      ]
    );

    return res.status(201).json({
      message: "Consulta agendada correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al agendar consulta:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// (Opcional) GET /api/agenda-consulta  (para admin, si lo ocupas después)
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM agenda_consulta ORDER BY creado_en DESC, id DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar agenda_consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
