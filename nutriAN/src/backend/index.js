// src/backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const serviciosRoutes = require("./routes/serviciosRoutes");
const materialRoutes = require("./routes/materialRoutes");
const comentariosRoutes = require("./routes/comentariosRoutes");

const app = express();

/* =====================
   CORS (CLAVE)
===================== */
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // https://software-six-weld.vercel.app
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS bloqueado: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());

/* =====================
   HEALTH CHECK
===================== */
app.get("/", (req, res) => {
  res.json({ message: "API AnNutrition funcionando" });
});

/* =====================
   ROUTES
===================== */
app.use("/api/auth", authRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/material", materialRoutes);
app.use("/api/comentarios", comentariosRoutes);

/* =====================
   SERVER
===================== */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});
