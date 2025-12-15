// routes/materialRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const {
  getAllMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materialController");

const router = express.Router();

// ================================
// 1. Asegurar carpeta de subida
// ================================
const uploadPath = path.join(__dirname, "..", "uploads", "materiales");

// Si no existe, crearla
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 Carpeta creada:", uploadPath);
}

// ================================
// 2. Configuración de Multer
// ================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

// ================================
// 3. Rutas CRUD
// Base: /api/admin/material
// ================================

// Obtener todo el material educativo
router.get("/", getAllMaterial);

// Crear nuevo material
//importante: "imagen" coincide con form.append("imagen", mat.file)
router.post("/", upload.single("imagen"), createMaterial);

// Actualizar material existente
router.put("/:id", upload.single("imagen"), updateMaterial);

// Eliminar material
router.delete("/:id", deleteMaterial);

// ================================
module.exports = router;
