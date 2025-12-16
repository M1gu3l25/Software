// src/backend/index.js
"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const pool = require("./db"); // tu db.js (mysql2/promise)
const { createTransporter } = require("./mailer"); // tu mailer.js
const authController = require("./authController"); // register/login/me (según lo que ya hicimos)

const app = express();

/* =========================
   CORS (Vercel + Local)
========================= */
const FRONTEND_URL = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
const allowedOrigins = [FRONTEND_URL, "http://localhost:5173"].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Permite Postman/curl (sin origin)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// Preflight
app.options("*", cors());

/* =========================
   Parsers
========================= */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   Healthcheck
========================= */
app.get("/", (req, res) => {
  res.json({ message: "API AnNutricion funcionando" });
});

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows?.[0]?.ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: "DB not reachable" });
  }
});

/* =========================
   AUTH
========================= */
app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);
app.get("/api/auth/me", authController.me); // requiere token (según tu authController)

/* =========================
   COMENTARIOS (tabla: comentarios)
   Campos (según tu diagrama):
   id, nombre, paciente_desde, calificacion, comentario, creado_en
========================= */
app.get("/api/comentarios", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, paciente_desde, calificacion, comentario, creado_en
       FROM comentarios
       ORDER BY creado_en DESC
       LIMIT 200`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

app.post("/api/comentarios", async (req, res) => {
  try {
    const { nombre, paciente_desde, calificacion, comentario } = req.body;

    if (!nombre || !comentario) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const rating =
      calificacion === undefined || calificacion === null
        ? null
        : Number(calificacion);

    const [result] = await pool.query(
      `INSERT INTO comentarios (nombre, paciente_desde, calificacion, comentario, creado_en)
       VALUES (?, ?, ?, ?, NOW())`,
      [nombre, paciente_desde || null, rating, comentario]
    );

    res.status(201).json({ ok: true, id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: "Error al guardar comentario" });
  }
});

/* =========================
   SERVICIOS (tabla: servicios)
   Campos (según tu diagrama):
   id, titulo, precio_texto, punto1, punto2, punto3,
   icono_tipo, icono_emoji, icono_imagen, orden, activo, creado_en, actualizado_en
========================= */
app.get("/api/servicios", async (req, res) => {
  try {
    const activos = req.query.activos; // "1" o "0"
    const where = activos === "1" ? "WHERE activo = 1" : "";
    const [rows] = await pool.query(
      `SELECT id, titulo, precio_texto, punto1, punto2, punto3,
              icono_tipo, icono_emoji, icono_imagen, orden, activo
       FROM servicios
       ${where}
       ORDER BY orden ASC, id ASC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener servicios" });
  }
});

/* =========================
   MATERIAL EDUCATIVO (tabla: material_educativo)
   Campos (según tu diagrama):
   id, categoria, emoji_categoria, titulo, descripcion, imagen_url,
   boton_texto, orden, activo, creado_en, actualizado_en
========================= */
app.get("/api/material", async (req, res) => {
  try {
    const activos = req.query.activos; // "1" o "0"
    const where = activos === "1" ? "WHERE activo = 1" : "";
    const [rows] = await pool.query(
      `SELECT id, categoria, emoji_categoria, titulo, descripcion, imagen_url,
              boton_texto, orden, activo
       FROM material_educativo
       ${where}
       ORDER BY orden ASC, id ASC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener material educativo" });
  }
});

/* =========================
   CONTACTO (tabla: contacto_mensajes) + correo (nodemailer)
   Campos:
   id, nombre_completo, correo_electronico, telefono, mensaje, creado_en
========================= */
app.post("/api/contacto", async (req, res) => {
  try {
    const { nombre_completo, correo_electronico, telefono, mensaje } = req.body;

    if (!nombre_completo || !correo_electronico || !mensaje) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    await pool.query(
      `INSERT INTO contacto_mensajes (nombre_completo, correo_electronico, telefono, mensaje, creado_en)
       VALUES (?, ?, ?, ?, NOW())`,
      [nombre_completo, correo_electronico, telefono || null, mensaje]
    );

    // Enviar mail (si hay config)
    const canMail =
      process.env.MAIL_HOST &&
      process.env.MAIL_PORT &&
      process.env.MAIL_USER &&
      process.env.MAIL_PASS &&
      process.env.MAIL_TO;

    if (canMail) {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: process.env.MAIL_TO,
        subject: "Nuevo mensaje de contacto - AnNutrition",
        text: `Nombre: ${nombre_completo}
Correo: ${correo_electronico}
Teléfono: ${telefono || "N/A"}

Mensaje:
${mensaje}`,
      });
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error al enviar contacto" });
  }
});

/* =========================
   AGENDA (tabla: agenda_consulta)
   Campos:
   id, nombre_completo, correo_electronico, telefono, fecha_preferida, mensaje, creado_en
========================= */
app.post("/api/agenda", async (req, res) => {
  try {
    const {
      nombre_completo,
      correo_electronico,
      telefono,
      fecha_preferida,
      mensaje,
    } = req.body;

    if (!nombre_completo || !correo_electronico || !telefono || !mensaje) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    await pool.query(
      `INSERT INTO agenda_consulta (nombre_completo, correo_electronico, telefono, fecha_preferida, mensaje, creado_en)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [nombre_completo, correo_electronico, telefono, fecha_preferida || null, mensaje]
    );

    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error al agendar consulta" });
  }
});

/* =========================
   404 API
========================= */
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

/* =========================
   Error handler (incluye CORS)
========================= */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

/* =========================
   Listen (Railway usa PORT)
========================= */
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en puerto ${PORT}`);
  console.log(`✅ FRONTEND_URL permitido: ${FRONTEND_URL || "(no definido)"}`);
});
