import express from "express";

const app = express();
app.use(express.json());

let productos = [
  { id: 1, nombre: "Producto 1", precio: 10 },
  { id: 2, nombre: "Producto 2", precio: 20 },
];
let nextId = 3;

app.get("/productos", (req, res) => {
  res.status(200).json(productos);
});

app.get("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (producto) {
    res.status(200).json(producto);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.listen(3000, () => console.log("Servidor escuchando en http://localhost:3000"));