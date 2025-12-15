// controllers/serviciosController.js
const pool = require("../db");

//Obtener todos los servicios (admin o público)
exports.getServicios = async (req, res) => {
  try {
    const soloActivos = req.query.activos === "1";
    const where = soloActivos ? "WHERE activo = 1" : "";

    const [rows] = await pool.query(
      `SELECT * FROM servicios ${where} ORDER BY orden ASC, id ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error getServicios:", err);
    res.status(500).json({ message: "Error al obtener servicios." });
  }
};

//Obtener un servicio por ID
exports.getServicioById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM servicios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Servicio no encontrado." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error getServicioById:", err);
    res.status(500).json({ message: "Error al obtener el servicio." });
  }
};

//Crear servicio
exports.createServicio = async (req, res) => {
  try {
    const {
      titulo,
      precio_texto,
      punto1,
      punto2,
      punto3,
      icono_tipo = "emoji",
      icono_emoji = "📅",
      orden = 1,
      activo = 1
    } = req.body;

    let icono_imagen = null;

    // SI mando imagen (multer subió algo)
    if (req.file) {
      icono_imagen = `/uploads/servicios/${req.file.filename}`;
    }

    if (!titulo || !precio_texto) {
      return res
        .status(400)
        .json({ message: "El título y el precio son obligatorios." });
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
        icono_tipo,
        icono_emoji,
        icono_imagen,
        orden,
        activo,
      ]
    );

    const [nuevo] = await pool.query(
      "SELECT * FROM servicios WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(nuevo[0]);
  } catch (err) {
    console.error("Error createServicio:", err);
    res.status(500).json({ message: "Error al crear el servicio." });
  }
};

//Actualizar servicio
exports.updateServicio = async (req, res) => {
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
      orden,
      activo
    } = req.body;

    const [prevRows] = await pool.query(
      "SELECT * FROM servicios WHERE id = ?",
      [id]
    );

    if (prevRows.length === 0) {
      return res.status(404).json({ message: "Servicio no encontrado." });
    }

    const actual = prevRows[0];

    let newImagen = actual.icono_imagen;

    if (req.file) {
      newImagen = `/uploads/servicios/${req.file.filename}`;
    }

    await pool.query(
      `UPDATE servicios SET
        titulo = ?, precio_texto = ?, 
        punto1 = ?, punto2 = ?, punto3 = ?,
        icono_tipo = ?, icono_emoji = ?, icono_imagen = ?,
        orden = ?, activo = ?
      WHERE id = ?`,
      [
        titulo ?? actual.titulo,
        precio_texto ?? actual.precio_texto,
        punto1 ?? actual.punto1,
        punto2 ?? actual.punto2,
        punto3 ?? actual.punto3,
        icono_tipo ?? actual.icono_tipo,
        icono_emoji ?? actual.icono_emoji,
        newImagen,
        orden ?? actual.orden,
        activo ?? actual.activo,
        id,
      ]
    );

    const [actualizado] = await pool.query(
      "SELECT * FROM servicios WHERE id = ?",
      [id]
    );

    res.json(actualizado[0]);
  } catch (err) {
    console.error("Error updateServicio:", err);
    res.status(500).json({ message: "Error al actualizar." });
  }
};

// Eliminar servicio
exports.deleteServicio = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM servicios WHERE id = ?", [id]);

    res.json({ message: "Servicio eliminado correctamente." });
  } catch (err) {
    console.error("Error deleteServicio:", err);
    res.status(500).json({ message: "Error al eliminar el servicio." });
  }
};
