// routes/serviciosRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// =======================================
// GET /api/admin/servicios
// Lista servicios activos
// =======================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM servicios WHERE activo = 1 ORDER BY orden ASC, id ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// =======================================
// POST /api/admin/servicios
// Crear nuevo servicio
// =======================================
router.post("/", async (req, res) => {
  try {
    const {
      titulo,
      precio_texto,
      punto1,
      punto2,
      punto3,
      icono_tipo,
      icono_emoji,
      icono_imagen,
      orden,
      activo,
    } = req.body;

    if (!titulo || !precio_texto) {
      return res
        .status(400)
        .json({ error: "Título y precio_texto son obligatorios" });
    }

    const [result] = await pool.query(
      `INSERT INTO servicios
       (titulo, precio_texto, punto1, punto2, punto3,
        icono_tipo, icono_emoji, icono_imagen, orden, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        precio_texto,
        punto1 || null,
        punto2 || null,
        punto3 || null,
        icono_tipo || "emoji",
        icono_emoji || null,
        icono_imagen || null,
        orden || 1,
        activo ?? 1,
      ]
    );

    res.status(201).json({
      message: "Servicio creado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear servicio:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// =======================================
// PUT /api/admin/servicios/:id
// Actualizar servicio
// =======================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      precio_texto,
      punto1,
      punto2,
      punto3,
      icono_tipo,
      icono_emoji,
      icono_imagen,
      orden,
      activo,
    } = req.body;

    if (!titulo || !precio_texto) {
      return res
        .status(400)
        .json({ error: "Título y precio_texto son obligatorios" });
    }

    await pool.query(
      `UPDATE servicios
       SET titulo = ?, precio_texto = ?, punto1 = ?, punto2 = ?, punto3 = ?,
           icono_tipo = ?, icono_emoji = ?, icono_imagen = ?, orden = ?, activo = ?
       WHERE id = ?`,
      [
        titulo,
        precio_texto,
        punto1 || null,
        punto2 || null,
        punto3 || null,
        icono_tipo || "emoji",
        icono_emoji || null,
        icono_imagen || null,
        orden || 1,
        activo ?? 1,
        id,
      ]
    );

    res.json({ message: "Servicio actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// =======================================
// DELETE /api/admin/servicios/:id
// Borrado lógico (activo = 0)
// =======================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE servicios SET activo = 0 WHERE id = ?",
      [id]
    );

    res.json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
