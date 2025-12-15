// controllers/materialController.js
const path = require("path");
const pool = require("../db");

// helper para construir la URL relativa de la imagen
const buildImageUrl = (file) => {
  if (!file) return null;
  // Lo que se guardará en la BD, luego se servirá como /uploads/materiales/...
  return `/uploads/materiales/${file.filename}`;
};

// GET /api/admin/material  y /api/material
const getAllMaterial = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, categoria, emoji_categoria, titulo, descripcion,
              imagen_url, boton_texto, orden
       FROM material_educativo
       ORDER BY orden ASC, id ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener material educativo:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el material educativo." });
  }
};

// POST /api/admin/material
const createMaterial = async (req, res) => {
  try {
    const {
      categoria,
      emoji_categoria,
      titulo,
      descripcion,
      boton_texto,
      orden,
    } = req.body;

    if (!categoria?.trim() || !titulo?.trim()) {
      return res.status(400).json({
        message: "categoria y titulo son obligatorios.",
      });
    }

    // si se subió archivo, usamos esa ruta, si no, null
    const imagen_url = buildImageUrl(req.file);

    const [result] = await pool.query(
      `INSERT INTO material_educativo
       (categoria, emoji_categoria, titulo, descripcion,
        imagen_url, boton_texto, orden)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        categoria,
        emoji_categoria || null,
        titulo,
        descripcion || null,
        imagen_url,
        boton_texto || "Más información",
        orden || 1,
      ]
    );

    const [rows] = await pool.query(
      `SELECT id, categoria, emoji_categoria, titulo, descripcion,
              imagen_url, boton_texto, orden
       FROM material_educativo
       WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error al crear material:", error);
    res.status(500).json({ message: "Error al crear el material educativo." });
  }
};

// PUT /api/admin/material/:id
const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      categoria,
      emoji_categoria,
      titulo,
      descripcion,
      boton_texto,
      orden,
      imagen_url: imagen_url_actual, // por si el frontend manda la ruta anterior
    } = req.body;

    if (!categoria?.trim() || !titulo?.trim()) {
      return res.status(400).json({
        message: "categoria y titulo son obligatorios.",
      });
    }

    // si hay nuevo archivo, se reemplaza; si no, se mantiene la que venía
    const nueva_imagen_url = buildImageUrl(req.file) || imagen_url_actual || null;

    const [result] = await pool.query(
      `UPDATE material_educativo
       SET categoria = ?,
           emoji_categoria = ?,
           titulo = ?,
           descripcion = ?,
           imagen_url = ?,
           boton_texto = ?,
           orden = ?
       WHERE id = ?`,
      [
        categoria,
        emoji_categoria || null,
        titulo,
        descripcion || null,
        nueva_imagen_url,
        boton_texto || "Más información",
        orden || 1,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Material no encontrado." });
    }

    const [rows] = await pool.query(
      `SELECT id, categoria, emoji_categoria, titulo, descripcion,
              imagen_url, boton_texto, orden
       FROM material_educativo
       WHERE id = ?`,
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al actualizar material:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el material educativo." });
  }
};

// DELETE /api/admin/material/:id
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM material_educativo WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Material no encontrado." });
    }

    res.json({ message: "Material eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar material:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar el material educativo." });
  }
};

module.exports = {
  getAllMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};
