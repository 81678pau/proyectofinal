import express from "express";
import db from "../db.js";

const router = express.Router();

// Obtener todos los productos con información de categoría
router.get("/", (req, res) => {
  const query = `
    SELECT p.*, c.name as categoryName 
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.categoryId
    ORDER BY p.createdAt DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener productos por categoría
router.get("/category/:categoryId", (req, res) => {
  const { categoryId } = req.params;

  const query = `
    SELECT p.*, c.name as categoryName 
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.categoryId
    WHERE p.categoryId = ?
    ORDER BY p.name
  `;

  db.query(query, [categoryId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener un producto por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT p.*, c.name as categoryName, u.username as createdBy
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.categoryId
    LEFT JOIN users u ON p.createdByUserId = u.userId
    WHERE p.productId = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(results[0]);
  });
});

// Crear producto
router.post("/", (req, res) => {
  const {
    name, description, price, stock, size, color,
    imageUrl, categoryId, createdByUserId
  } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({
      error: "Nombre, precio y stock son obligatorios"
    });
  }

  const query = `
    INSERT INTO products 
    (name, description, price, stock, size, color, imageUrl, categoryId, createdByUserId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      name,
      description || null,
      price,
      stock,
      size || null,
      color || null,
      imageUrl || null,
      categoryId || null,
      createdByUserId || null
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        mensaje: "Producto creado exitosamente",
        productId: result.insertId
      });
    }
  );
});

// Eliminar producto
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM products WHERE productId = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  });
});

export default router;