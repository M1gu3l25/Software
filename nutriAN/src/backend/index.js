// src/backend/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const serviciosRoutes = require("./routes/servicios");
const comentariosRoutes = require("./routes/comentarios");
const materialRoutes = require("./routes/material");

const app = express();

// =====================
// CORS (CLARO Y SEGURO)
// =====================
const FRONTEND_URL = process.env.FRONTEND_URL;

if (!FRONTEND_URL) {
  console.error("❌ FRONTEND_URL no está definido");
  process.exit(1);
}

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

// =====================
// HEALTH CHECK
// =====================
app.get("/api/health", (req, res) => {
  res.json({ message: "API AnNutrition funcionando" });
});

// =====================
// ROUTES
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/comentarios", comentariosRoutes);
app.use("/api/material", materialRoutes);

// =====================
// START SERVER (CLAVE)
// =====================
const PORT = process.env.PORT; // 🚨 NO valor por defecto

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend corriendo en puerto ${PORT}`);
});
