// src/backend/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const pool = require("./db");

// Rutas específicas (admin)
const serviciosRoutes = require("./routes/serviciosRoutes");
const materialRoutes = require("./routes/materialRoutes");

// Controladores públicos
const { getAllMaterial } = require("./controllers/materialController");
const { getServicios } = require("./controllers/serviciosController");

// Rutas de autenticación (login / register / forgot / reset)
const authRoutes = require("./routes/authRoutes");

// Mailer (Outlook)
const { createTransporter } = require("./mail/mailer");

const app = express();

// ===============================
// MIDDLEWARES GLOBALES
// ===============================
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (iconos / imágenes subidas)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
//  RUTA RAÍZ PARA PROBAR
// ===============================
app.get("/", (req, res) => {
  res.json({ message: "API AnNutricion funcionando" });
});

// ===============================
//  AUTH (LOGIN / REGISTER / FORGOT / RESET)
// ===============================
app.use("/api/auth", authRoutes);

/* =====================================================
   1) AGENDA TU CONSULTA  (tabla: agenda_consulta)
   + ENVÍA CORREO
   ===================================================== */

app.post("/api/agenda-consulta", async (req, res) => {
  try {
    const {
      nombre_completo,
      correo_electronico,
      telefono,
      fecha_preferida,
      mensaje,
    } = req.body;

    if (!nombre_completo || !correo_electronico || !fecha_preferida) {
      return res.status(400).json({
        error: "Nombre, correo y fecha preferida son obligatorios",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO agenda_consulta
       (nombre_completo, correo_electronico, telefono, fecha_preferida, mensaje)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nombre_completo,
        correo_electronico,
        telefono || null,
        fecha_preferida,
        mensaje || null,
      ]
    );

    //Enviar correo (no romper si falla)
    try {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: `"AnNutrition Web" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO || "an.nutricion@outlook.com",
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
      // NO devolvemos error, porque la consulta ya se guardó en DB
    }

    res.status(201).json({
      message: "Consulta agendada correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al agendar consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Listar todas las consultas (ASESOR / ADMIN)
app.get("/api/agenda-consulta", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM agenda_consulta ORDER BY creado_en DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener consultas:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

/* =====================================================
   2) MATERIAL EDUCATIVO (ENDPOINT SIMPLE ANTIGUO, opcional)
   ===================================================== */

app.get("/api/material-educativo", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM material_educativo ORDER BY orden ASC, id ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener material educativo:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

/* =====================================================
   3) COMENTARIOS (tabla: comentarios)
   ===================================================== */

app.post("/api/comentarios", async (req, res) => {
  try {
    const { nombre, paciente_desde, calificacion, comentario } = req.body;

    if (!nombre || !comentario) {
      return res.status(400).json({
        error: "Nombre y comentario son obligatorios",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO comentarios
       (nombre, paciente_desde, calificacion, comentario)
       VALUES (?, ?, ?, ?)`,
      [nombre, paciente_desde || null, calificacion || null, comentario]
    );

    res.status(201).json({
      message: "Comentario registrado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get("/api/comentarios", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM comentarios ORDER BY creado_en DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

/* =====================================================
   4) CONTACTO (tabla: contacto_mensajes)
   + ENVÍA CORREO
   ===================================================== */

app.post("/api/contacto", async (req, res) => {
  try {
    const { nombre_completo, correo_electronico, telefono, mensaje } = req.body;

    if (!nombre_completo || !correo_electronico || !mensaje) {
      return res.status(400).json({
        error: "Nombre completo, correo electrónico y mensaje son obligatorios",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO contacto_mensajes
       (nombre_completo, correo_electronico, telefono, mensaje)
       VALUES (?, ?, ?, ?)`,
      [nombre_completo, correo_electronico, telefono || null, mensaje]
    );

    //Enviar correo (no romper si falla)
    try {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: `"AnNutrition Web" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO || "an.nutricion@outlook.com",
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
      // NO devolvemos error, porque el mensaje ya se guardó en DB
    }

    res.status(201).json({
      message: "Mensaje enviado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al enviar mensaje de contacto:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get("/api/contacto", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM contacto_mensajes ORDER BY creado_en DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener mensajes de contacto:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

/* =====================================================
   5) SERVICIOS (tabla: servicios)
   ===================================================== */

// CRUD admin
app.use("/api/admin/servicios", serviciosRoutes);

// ENDPOINT PÚBLICO para usuarios:
// GET http://localhost:4000/api/servicios?activos=1
app.get("/api/servicios", getServicios);

/* =====================================================
   6) MATERIAL EDUCATIVO (ADMIN + PÚBLICO)
   ===================================================== */

// CRUD admin
app.use("/api/admin/material", materialRoutes);

// ENDPOINT público para la página de usuarios
app.get("/api/material", getAllMaterial);

/* ==============================
   INICIAR SERVIDOR
   ============================== */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor AnNutricion escuchando en http://localhost:${PORT}`);
});
