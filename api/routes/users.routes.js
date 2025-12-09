import express from "express";
import db from "../db.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Crear usuario
router.post("/", (req, res) => {
  const { username, email, password, role, phoneNumber } = req.body;

  const query = `
    INSERT INTO users (username, email, password, role, phoneNumber)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [username, email, password, role || 'cliente', phoneNumber], (err, result) => {
    if (err) {
      console.error("Error al crear usuario:", err);
      
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "El email ya está registrado" });
      }
      
      return res.status(500).json({ error: "Error al crear usuario" });
    }

    res.status(201).json({ 
      mensaje: "Usuario creado exitosamente", 
      userId: result.insertId 
    });
  });
});

// Actualizar usuario
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, phoneNumber } = req.body;

  const query = `
    UPDATE users 
    SET username = ?, email = ?, password = ?, role = ?, phoneNumber = ?
    WHERE userId = ?
  `;

  db.query(query, [username, email, password, role, phoneNumber, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario actualizado" });
  });
});

// Eliminar usuario
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE userId = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario eliminado" });
  });
});

export default router;