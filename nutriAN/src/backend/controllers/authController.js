// src/backend/controllers/authController.js
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("../db"); // tu conexión MySQL

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// === TRANSPORTER DE NODEMAILER ===
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true", // true para 465, false para 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper para crear token JWT
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

// ====================== LOGIN ======================
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son obligatorios." });
    }

    const [rows] = await pool.query(
      "SELECT id, nombre, email, password, role FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

// ====================== REGISTRO / CREAR CUENTA ======================
async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ ok: false, message: "Nombre, email y contraseña son obligatorios." });
    }

    // ¿ya existe el correo?
    const [rows] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );
    if (rows.length > 0) {
      return res
        .status(409)
        .json({ ok: false, message: "Ya existe una cuenta con ese correo." });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, role, creado_en) VALUES (?, ?, ?, 'user', NOW())",
      [nombre, email, hash]
    );

    const user = {
      id: result.insertId,
      nombre,
      email,
      role: "user",
    };

    const token = generateToken(user);

    return res.status(201).json({
      ok: true,
      message: "Cuenta creada correctamente.",
      user,
      token,
    });
  } catch (err) {
    console.error("Error en register:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Error interno al crear la cuenta." });
  }
}

// ====================== OLVIDÉ MI CONTRASEÑA ======================
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ ok: false, message: "El correo es obligatorio." });
    }

    // Buscar usuario
    const [users] = await pool.query(
      "SELECT id, nombre FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    // Por seguridad, respondemos igual aunque no exista
    if (users.length === 0) {
      return res.json({
        ok: true,
        message:
          "Si el correo existe en nuestro sistema, te enviaremos un enlace para restablecer tu contraseña.",
      });
    }

    const user = users[0];

    // Generar token aleatorio
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // +1 hora

    // Guardar en tabla password_resets
    await pool.query(
      "INSERT INTO password_resets (user_id, token, expires_at, usado, creado_en) VALUES (?, ?, ?, 0, NOW())",
      [user.id, token, expiresAt]
    );

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

    // Enviar correo
    await transporter.sendMail({
      from: `"AnNutrition" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Restablecer contraseña - AnNutrition",
      html: `
        <p>Hola ${user.nombre || ""},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace (o cópialo en tu navegador):</p>
        <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
        <p>Este enlace es válido durante 1 hora.</p>
        <p>Si tú no solicitaste este cambio, puedes ignorar este correo.</p>
        <br/>
        <p>Equipo AnNutrition</p>
      `,
    });

    return res.json({
      ok: true,
      message:
        "Si el correo existe en nuestro sistema, te enviaremos un enlace para restablecer tu contraseña.",
    });
  } catch (err) {
    console.error("Error en forgotPassword:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Error al procesar la solicitud." });
  }
}

// ====================== RESET PASSWORD ======================
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        ok: false,
        message: "Token y nueva contraseña son obligatorios.",
      });
    }

    // Buscar token
    const [rows] = await pool.query(
      "SELECT * FROM password_resets WHERE token = ? AND usado = 0 ORDER BY creado_en DESC LIMIT 1",
      [token]
    );

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Token inválido o ya utilizado." });
    }

    const resetRow = rows[0];

    // Validar expiración
    const ahora = new Date();
    const expira = new Date(resetRow.expires_at);
    if (ahora > expira) {
      return res
        .status(400)
        .json({ ok: false, message: "El token ha expirado." });
    }

    // Actualizar contraseña del usuario
    const hash = await bcrypt.hash(password, 10);
    await pool.query("UPDATE usuarios SET password = ? WHERE id = ?", [
      hash,
      resetRow.user_id,
    ]);

    // Marcar token como usado
    await pool.query("UPDATE password_resets SET usado = 1 WHERE id = ?", [
      resetRow.id,
    ]);

    return res.json({
      ok: true,
      message: "Tu contraseña se actualizó correctamente.",
    });
  } catch (err) {
    console.error("Error en resetPassword:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Error al restablecer la contraseña." });
  }
}

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
};
