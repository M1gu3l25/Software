// backend/seedAdmin.js
const bcrypt = require("bcryptjs");
const pool = require("./db");
require("dotenv").config();

async function seedAdmin() {
  try {
    const nombre = "Admin NutriAn";
    const email = "admin@nutrian.com";
    const passwordPlano = "Admin123!"; // cámbiala si quieres
    const role = "admin";

    // ¿Ya existe ese correo?
    const [existing] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      console.log("⚠️  Ya existe un usuario con ese correo. No se insertó nada.");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(passwordPlano, 10);

    await pool.query(
      "INSERT INTO usuarios (nombre, email, password, role) VALUES (?,?,?,?)",
      [nombre, email, hashed, role]
    );

    console.log("✅ Admin creado con éxito.");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${passwordPlano}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creando admin:", err);
    process.exit(1);
  }
}

seedAdmin();
