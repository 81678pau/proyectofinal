import express from "express";
import db from "../db.js";

const router = express.Router();

// Obtener todos los items
router.get("/", (req, res) => {
  db.query("SELECT * FROM order_items", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Crear item dentro de una orden
router.post("/", (req, res) => {
  const { orderId, productId, quantity, price } = req.body;

  const query = `
    INSERT INTO order_items (orderId, productId, quantity, price)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [orderId, productId, quantity, price], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al crear item", details: err });

    res.json({ message: "Item agregado a la orden", id: result.insertId });
  });
});

// Actualizar item
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { quantity, price } = req.body;

  const query = `
    UPDATE order_items
    SET quantity = ?, price = ?
    WHERE orderItemId = ?
  `;

  db.query(query, [quantity, price, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item actualizado correctamente" });
  });
});

// Eliminar item
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM order_items WHERE orderItemId = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item eliminado correctamente" });
  });
});

export default router;
