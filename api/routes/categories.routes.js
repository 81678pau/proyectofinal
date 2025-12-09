import express from "express";
import db from "../db.js";

const router = express.Router();

// Obtener todas las categorías activas
router.get("/", (req, res) => {
  db.query("SELECT * FROM categories WHERE status = 'active' ORDER BY name", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener todas las categorías (incluyendo inactivas) - para admin
router.get("/all", (req, res) => {
  db.query("SELECT * FROM categories ORDER BY name", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener una categoría por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM categories WHERE categoryId = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(results[0]);
  });
});

// Crear categoría
router.post("/", (req, res) => {
  const { name, description, imageUrl, status, season, gender } = req.body;

  if (!name) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  const query = `
    INSERT INTO categories (name, description, imageUrl, status, season, gender)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      name,
      description || null,
      imageUrl || null,
      status || 'active',
      season || 'All Seasons',
      gender || 'Unisex'
    ],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: "Ya existe una categoría con ese nombre" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        mensaje: "Categoría creada exitosamente",
        categoryId: result.insertId
      });
    }
  );
});

// Eliminar categoría (soft delete - cambiar status a 'inactive')
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE categories SET status = 'inactive' WHERE categoryId = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Categoría no encontrada" });
      }
      res.json({ message: "Categoría desactivada correctamente" });
    }
  );
});

export default router;