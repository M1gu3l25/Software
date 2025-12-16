// src/backend/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const pool = require("./db");

// Routes
const serviciosRoutes = require("./routes/serviciosRoutes");
const materialRoutes = require("./routes/materialRoutes");
const authRoutes = require("./routes/authRoutes");

// Controllers públicos
const { getAllMaterial } = require("./controllers/materialController");
const { getServicios } = require("./controllers/serviciosController");

// Mail
const { createTransporter } = require("./mail/mailer");

const app = express();

/* ============================
   CORS — 🔥 CLAVE DEL PROBLEMA
   ============================ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://software-six-weld.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS no permitido"), false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ============================
   RUTA TEST
   ============================ */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API AnNutrition funcionando" });
});

/* ============================
   AUTH
   ============================ */
app.use("/api/auth", authRoutes);

/* ============================
   COMENTARIOS
   ============================ */
app.get("/api/comentarios", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM comentarios ORDER BY creado_en DESC"
  );
  res.json(rows);
});

/* ============================
   SERVICIOS
   ============================ */
app.use("/api/admin/servicios", serviciosRoutes);
app.get("/api/servicios", getServicios);

/* ============================
   MATERIAL
   ============================ */
app.use("/api/admin/material", materialRoutes);
app.get("/api/material", getAllMaterial);

/* ============================
   START
   ============================ */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend en puerto ${PORT}`);
});
