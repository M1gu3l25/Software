// src/backend/controllers/comentariosController.js
"use strict";

const pool = require("../db");

// GET /api/comentarios
// Devuelve comentarios listos para pintar en tu UI (incluye iniciales)
async function getComentarios(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, paciente_desde, calificacion, comentario, creado_en
       FROM comentarios
       ORDER BY creado_en DESC, id DESC`
    );

    const data = rows.map((r) => {
      const nombre = r.nombre || "";
      const iniciales = nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || "")
        .join("");

      return {
        id: r.id,
        nombre: r.nombre,
        desde: r.paciente_desde ? Number(r.paciente_desde) : null,
        calificacion: Number(r.calificacion || 0),
        comentario: r.comentario,
        creado_en: r.creado_en,
        iniciales,
      };
    });

    return res.json(data);
  } catch (err) {
    console.error("❌ Error getComentarios:", err);
    return res.status(500).json({ message: "Error al obtener comentarios" });
  }
}

// POST /api/comentarios
async function createComentario(req, res) {
  try {
    const { nombre, desde, calificacion, comentario } = req.body || {};

    if (!nombre || !comentario) {
      return res.status(400).json({ message: "Nombre y comentario son obligatorios" });
    }

    const cal = Number(calificacion);
    if (!Number.isFinite(cal) || cal < 1 || cal > 5) {
      return res.status(400).json({ message: "Calificación inválida (1 a 5)" });
    }

    // en tu tabla paciente_desde es VARCHAR(50), guardamos como texto
    const pacienteDesde =
      desde === null || desde === undefined || String(desde).trim() === ""
        ? null
        : String(desde);

    const [result] = await pool.query(
      `INSERT INTO comentarios (nombre, paciente_desde, calificacion, comentario, creado_en)
       VALUES (?, ?, ?, ?, NOW())`,
      [nombre.trim(), pacienteDesde, cal, comentario.trim()]
    );

    return res.status(201).json({
      message: "Comentario guardado",
      id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error createComentario:", err);
    return res.status(500).json({ message: "Error al guardar comentario" });
  }
}

module.exports = {
  getComentarios,
  createComentario,
};
