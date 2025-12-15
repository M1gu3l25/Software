// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Verifica que el usuario tenga un token válido.
 * Lee el token desde: Authorization: Bearer <token>
 */
function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No autorizado. Falta token." });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ message: "Formato de autorización inválido." });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // { id, email, role, nombre, iat, exp }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verificando token:", err);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
}

/**
 * Verifica que el usuario autenticado sea admin.
 */
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Solo administradores." });
  }
  next();
}

module.exports = { authRequired, adminOnly };
