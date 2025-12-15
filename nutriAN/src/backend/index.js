// src/backend/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const pool = require("./db");

// Rutas (admin)
const serviciosRoutes = require("./routes/serviciosRoutes");
const materialRoutes = require("./routes/materialRoutes");

// Controladores públicos
const { getAllMaterial } = require("./controllers/materialController");
const { getServicios } = require("./controllers/serviciosController");

// Auth routes
const authRoutes = require("./routes/authRoutes");

// Mailer (Outlook) (solo se usa dentro de endpoints)
const { createTransporter } = require("./mail/mailer");

const app = express();

// ===============================
// CORS (LOCAL + VERCEL)
// ===============================
const FRONTEND_URL = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, cb) {
      // Permitir requests sin origin (Postman, curl, server-to-server)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS bloqueado para origin: ${origin}`));
    },
    credentials: true,
  })
);

// ===============================
// MIDDLEWARES
// ===============================
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// RUTAS BÁSICAS
// ===============================
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API AnNutrition funcionando" });
});

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows?.[0]?.ok === 1 });
  } catch (e) {
    console.error("Health DB error:", e);
    res.status(500).json({ ok: false, message: "DB no disponible" });
  }
});

// ===============================
// AUTH
// ===============================
app.use("/api/auth", authRoutes);

/* =====================================================
   1) AGENDA TU CONSULTA
   ===================================================== */
app.post("/api/agenda-consulta", async (req, res) => {
  try {
    const { nombre_completo, correo_electronico, telefono, fecha_preferida, mensaje } = req.body;

    if (!nombre_completo || !correo_electronico || !fecha_preferida) {
      return res.status(400).json({
        ok: false,
        error: "Nombre, correo y fecha preferida son obligatorios",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO agenda_consulta
       (nombre_completo, correo_electronico, telefono, fecha_preferida, mensaje)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre_completo, correo_electronico, telefono || null, fecha_preferida, mensaje || null]
    );

    // Enviar correo (no romper si falla)
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"AnNutrition Web" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO || process.env.MAIL_USER,
        replyTo: correo_electronico,
        subject: "Nueva solicitud de consulta (Web)",
        html: `
          <h2>Nueva solicitud de consulta (Web)</h2>
          <p><b>Nombre:</b> ${nombre_completo}</p>
          <p><b>Correo:</b> ${correo_electronico}</p>
          <p><b>Teléfono:</b> ${telefono || "No proporcionado"}</p>
          <p><b>Fecha preferida:</b> ${fecha_preferida}</p>
          <p><b>Mensaje:</b></p>
          <pre style="white-space:pre-wrap">${mensaje || ""}</pre>
        `,
      });
    } catch (mailErr) {
      console.error("⚠️ Error enviando correo (agenda-consulta):", mailErr);
    }

    return res.status(201).json({
      ok: true,
      message: "Consulta agendada correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al agendar consulta:", error);
    return res.status(500).json({ ok: false, error: "Error en el servidor" });
  }
});

app.get("/api/agenda-consulta", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM agenda_consulta ORDER BY creado_en DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener consultas:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

/* =====================================================
   2) MATERIAL EDUCATIVO (endpoint viejo opcional)
   ===================================================== */
app.get("/api/material-educativo", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM material_educativo ORDER BY orden ASC, id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener material educativo:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

/* =====================================================
   3) COMENTARIOS
   ===================================================== */
app.post("/api/comentarios", async (req, res) => {
  try {
    const { nombre, paciente_desde, calificacion, comentario } = req.body;

    if (!nombre || !comentario) {
      return res.status(400).json({ ok: false, error: "Nombre y comentario son obligatorios" });
    }

    const [result] = await pool.query(
      `INSERT INTO comentarios (nombre, paciente_desde, calificacion, comentario)
       VALUES (?, ?, ?, ?)`,
      [nombre, paciente_desde || null, calificacion || 5, comentario]
    );

    res.status(201).json({ ok: true, message: "Comentario registrado correctamente", id: result.insertId });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ ok: false, error: "Error en el servidor" });
  }
});

app.get("/api/comentarios", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM comentarios ORDER BY creado_en DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

/* =====================================================
   4) CONTACTO
   ===================================================== */
app.post("/api/contacto", async (req, res) => {
  try {
    const { nombre_completo, correo_electronico, telefono, mensaje } = req.body;

    if (!nombre_completo || !correo_electronico || !mensaje) {
      return res.status(400).json({
        ok: false,
        error: "Nombre completo, correo electrónico y mensaje son obligatorios",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO contacto_mensajes (nombre_completo, correo_electronico, telefono, mensaje)
       VALUES (?, ?, ?, ?)`,
      [nombre_completo, correo_electronico, telefono || null, mensaje]
    );

    // Enviar correo (no romper si falla)
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"AnNutrition Web" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO || process.env.MAIL_USER,
        replyTo: correo_electronico,
        subject: "Nuevo mensaje de contacto (Web)",
        html: `
          <h2>Nuevo mensaje de contacto (Web)</h2>
          <p><b>Nombre:</b> ${nombre_completo}</p>
          <p><b>Correo:</b> ${correo_electronico}</p>
          <p><b>Teléfono:</b> ${telefono || "No proporcionado"}</p>
          <p><b>Mensaje:</b></p>
          <pre style="white-space:pre-wrap">${mensaje}</pre>
        `,
      });
    } catch (mailErr) {
      console.error("⚠️ Error enviando correo (contacto):", mailErr);
    }

    res.status(201).json({ ok: true, message: "Mensaje enviado correctamente", id: result.insertId });
  } catch (error) {
    console.error("Error al enviar mensaje de contacto:", error);
    res.status(500).json({ ok: false, error: "Error en el servidor" });
  }
});

app.get("/api/contacto", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM contacto_mensajes ORDER BY creado_en DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener mensajes de contacto:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

/* =====================================================
   5) SERVICIOS
   ===================================================== */
// CRUD admin
app.use("/api/admin/servicios", serviciosRoutes);
// público
app.get("/api/servicios", getServicios);

/* =====================================================
   6) MATERIAL EDUCATIVO
   ===================================================== */
// CRUD admin
app.use("/api/admin/material", materialRoutes);
// público
app.get("/api/material", getAllMaterial);

// ==============================
// INICIAR SERVIDOR
// ==============================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor AnNutrition escuchando en http://localhost:${PORT}`);
  if (allowedOrigins.length) console.log("CORS allowed:", allowedOrigins);
});
