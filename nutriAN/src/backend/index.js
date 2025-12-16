const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* =====================
   CORS (CRÍTICO)
===================== */
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir llamadas sin origin (Postman, curl, healthchecks)
      if (!origin) return callback(null, true);

      if (origin === FRONTEND_URL) {
        return callback(null, true);
      }

      console.error("❌ CORS bloqueado:", origin);
      return callback(new Error("CORS no permitido"));
    },
    credentials: true,
  })
);

/* =====================
   PARSERS
===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
   HEALTHCHECK
===================== */
app.get("/", (req, res) => {
  res.json({ message: "API AnNutrition funcionando" });
});

/* =====================
   ROUTES
===================== */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/material", require("./routes/materialRoutes"));
app.use("/api/servicios", require("./routes/serviciosRoutes"));
app.use("/api/comentarios", require("./routes/comentariosRoutes"));

/* =====================
   ERROR HANDLER (OBLIGATORIO)
===================== */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR GLOBAL:", err.message);
  res.status(500).json({ message: "Error interno del servidor" });
});

/* =====================
   SERVER
===================== */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});
