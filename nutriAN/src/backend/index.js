// src/backend/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// =====================
// Importación de rutas
// =====================
const authRoutes = require("./routes/authRoutes");
const materialRoutes = require("./routes/materialRoutes");
const serviciosRoutes = require("./routes/serviciosRoutes");
const comentariosRoutes = require("./routes/comentariosRoutes");

// ✅ NUEVAS RUTAS
const agendaRoutes = require("./routes/agendaRoutes");
const contactoRoutes = require("./routes/contactoRoutes");

const app = express();

// =====================
// CORS
// =====================
const allowedOrigins = [
  process.env.FRONTEND_URL, // ej: https://software-six-weld.vercel.app
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Permite Postman / server-to-server
      if (!origin) return cb(null, true);

      // Permite frontend principal
      if (allowedOrigins.includes(origin)) return cb(null, true);

      // Permite previews de Vercel
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return cb(null, true);

      return cb(new Error(`CORS bloqueado para: ${origin}`), false);
    },
    credentials: true,
  })
);

// =====================
// Middlewares
// =====================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =====================
// Static (uploads)
// =====================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =====================
// Health check
// =====================
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "AnNutrition API",
    ts: Date.now(),
  });
});

// =====================
// API Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/material", materialRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/comentarios", comentariosRoutes);

// ✅ NUEVAS RUTAS (para principal.tsx)
app.use("/api/agenda-consulta", agendaRoutes);
app.use("/api/contacto", contactoRoutes);

// =====================
// 404 handler
// =====================
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// =====================
// Error handler
// =====================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// =====================
// Listen (Railway)
// =====================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API corriendo en puerto ${PORT}`);
});
