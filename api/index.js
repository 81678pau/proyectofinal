// index.js
import express from "express";
import cors from "cors";

import usersRoutes from "./routes/users.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import productsRoutes from "./routes/products.routes.js";
import ordersRoutes from "./routes/orders.routes.js"; // 👈 Nuevo

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/users", usersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes); // 👈 Nuevo

app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando correctamente" });
});

app.listen(port, () => {
  console.log("🚀 Backend corriendo en http://localhost:" + port);
});