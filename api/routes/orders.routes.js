import express from "express";
import db from "../db.js";

const router = express.Router();

// Obtener todas las órdenes de un usuario
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT * FROM orders 
    WHERE userId = ? 
    ORDER BY orderDate DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener detalle de una orden con sus items
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const queryOrder = "SELECT * FROM orders WHERE orderId = ?";
  const queryItems = `
    SELECT oi.*, p.name as productName, p.imageUrl 
    FROM order_items oi
    JOIN products p ON oi.productId = p.productId
    WHERE oi.orderId = ?
  `;

  db.query(queryOrder, [id], (err, orderResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (orderResults.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    db.query(queryItems, [id], (err, itemsResults) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        order: orderResults[0],
        items: itemsResults
      });
    });
  });
});

// Crear nueva orden (desde el carrito)
router.post("/", (req, res) => {
  const { userId, items, total } = req.body;

  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ error: "Usuario e items son obligatorios" });
  }

  // Crear la orden
  const queryOrder = `
    INSERT INTO orders (userId, total, status) 
    VALUES (?, ?, 'pending')
  `;

  db.query(queryOrder, [userId, total], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const orderId = result.insertId;

    // Insertar los items de la orden
    const queryItems = `
      INSERT INTO order_items (orderId, productId, quantity, price) 
      VALUES ?
    `;

    const values = items.map(item => [
      orderId,
      item.productId,
      item.quantity,
      item.price
    ]);

    db.query(queryItems, [values], async (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // Actualizar stock de productos (Esperar a que termine)
      try {
        const updatePromises = items.map(item => {
          return new Promise((resolve, reject) => {
            const updateStockQuery = "UPDATE products SET stock = stock - ? WHERE productId = ?";
            db.query(updateStockQuery, [item.quantity, item.productId], (err, result) => {
              if (err) {
                console.error(` Error updating stock for product ${item.productId}:`, err);
                reject(err);
              } else {
                console.log(` Stock updated for product ${item.productId}. Affected rows: ${result.affectedRows}`);
                resolve(result);
              }
            });
          });
        });

        await Promise.all(updatePromises);
        console.log(" All stock updates completed.");

        res.status(201).json({
          mensaje: "Orden creada exitosamente",
          orderId: orderId
        });

      } catch (updateError) {
        console.error(" Error during stock updates:", updateError);
        res.status(201).json({
          mensaje: "Orden creada, pero hubo error al actualizar stock",
          orderId: orderId
        });
      }
    });
  });
});

// Actualizar estado de orden
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE orders SET status = ? WHERE orderId = ?";

  db.query(query, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    res.json({ message: "Estado actualizado correctamente" });
  });
});

export default router;