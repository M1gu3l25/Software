// src/backend/controllers/authController.js
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { createTransporter } = require("../mail/mailer");

// =====================
// CONFIG
// =====================
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET no está definido en variables de entorno");
}

// =====================
// JWT
// =====================
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      nombre: user.nombre,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

// =====================
// LOGIN
// =====================
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    const [rows] = await pool.query(
      "SELECT id, nombre, email, password, role FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// =====================
// REGISTER
// =====================
async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: "Nombre, email y contraseña son obligatorios",
      });
    }

    const [exists] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    if (exists.length > 0) {
      return res.status(409).json({
        message: "Ya existe una cuenta con ese correo",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, role, creado_en)
       VALUES (?, ?, ?, 'user', NOW())`,
      [nombre, email, hash]
    );

    const user = {
      id: result.insertId,
      nombre,
      email,
      role: "user",
    };

    const token = generateToken(user);

    res.status(201).json({
      message: "Cuenta creada correctamente",
      user,
      token,
    });
  } catch (err) {
    console.error("❌ Error en register:", err);
    res.status(500).json({ message: "Error interno al crear la cuenta" });
  }
}

// =====================
// FORGOT PASSWORD
// =====================
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "El correo es obligatorio",
      });
    }

    const [users] = await pool.query(
      "SELECT id, nombre FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    // Respuesta neutra por seguridad
    if (users.length === 0) {
      return res.json({
        message:
          "Si el correo existe, recibirás un enlace para restablecer tu contraseña",
      });
    }

    const user = users[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO password_resets
       (user_id, token, expires_at, usado, creado_en)
       VALUES (?, ?, ?, 0, NOW())`,
      [user.id, token, expiresAt]
    );

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"AnNutrition" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Restablecer contraseña - AnNutrition",
      html: `
        <p>Hola ${user.nombre},</p>
        <p>Solicitaste restablecer tu contraseña.</p>
        <p>
          <a href="${resetLink}" target="_blank">
            Restablecer contraseña
          </a>
        </p>
        <p>Este enlace es válido por 1 hora.</p>
        <br/>
        <p>Equipo AnNutrition</p>
      `,
    });

    res.json({
      message:
        "Si el correo existe, recibirás un enlace para restablecer tu contraseña",
    });
  } catch (err) {
    console.error("❌ Error en forgotPassword:", err);
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
}

// =====================
// RESET PASSWORD
// =====================
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token y nueva contraseña son obligatorios",
      });
    }

    const [rows] = await pool.query(
      `SELECT * FROM password_resets
       WHERE token = ? AND usado = 0
       ORDER BY creado_en DESC LIMIT 1`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Token inválido o ya utilizado",
      });
    }

    const reset = rows[0];

    if (new Date() > new Date(reset.expires_at)) {
      return res.status(400).json({
        message: "El token ha expirado",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE usuarios SET password = ? WHERE id = ?",
      [hash, reset.user_id]
    );

    await pool.query(
      "UPDATE password_resets SET usado = 1 WHERE id = ?",
      [reset.id]
    );

    res.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (err) {
    console.error("❌ Error en resetPassword:", err);
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
}

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
};
