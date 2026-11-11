import express from "express";

const app = express();
app.use(express.json());

let productos = [
  { id: 1, nombre: "Producto 1", precio: 10 },
  { id: 2, nombre: "Producto 2", precio: 20 },
];
let nextId = 3;

// ---------- Utilidades ----------

function parsearId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function buscarIndice(id) {
  return productos.findIndex((p) => p.id === id);
}

// Valida nombre y precio. Con `parcial = true` (PATCH) solo valida los campos enviados.
function validarProducto(body, parcial = false) {
  const errores = [];

  if (!parcial || body.nombre !== undefined) {
    if (typeof body.nombre !== "string" || body.nombre.trim() === "") {
      errores.push("El nombre es obligatorio y no puede estar vacío");
    }
  }

  if (!parcial || body.precio !== undefined) {
    if (
      typeof body.precio !== "number" ||
      !Number.isFinite(body.precio) ||
      body.precio < 0
    ) {
      errores.push("El precio es obligatorio y debe ser un número mayor o igual a 0");
    }
  }

  return errores;
}

function responder400(res, errores) {
  return res.status(400).json({ error: "Datos inválidos", detalles: errores });
}

// ---------- GET /productos ----------

app.get("/productos", (req, res) => {
  res.status(200).json(productos);
});

// ---------- GET /productos/:id ----------

app.get("/productos/:id", (req, res) => {
  const id = parsearId(req.params.id);
  const indice = id === null ? -1 : buscarIndice(id);

  if (indice === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.status(200).json(productos[indice]);
});

// ---------- POST /productos ----------

app.post("/productos", (req, res) => {
  const body = req.body ?? {};
  const errores = validarProducto(body);

  if (errores.length > 0) {
    return responder400(res, errores);
  }

  const producto = {
    id: nextId++,
    nombre: body.nombre.trim(),
    precio: body.precio,
  };

  productos.push(producto);
  res.status(201).json(producto);
});

// ---------- PUT /productos/:id ----------

app.put("/productos/:id", (req, res) => {
  const id = parsearId(req.params.id);
  const indice = id === null ? -1 : buscarIndice(id);

  if (indice === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const body = req.body ?? {};
  const errores = validarProducto(body);

  if (errores.length > 0) {
    return responder400(res, errores);
  }

  const producto = {
    id,
    nombre: body.nombre.trim(),
    precio: body.precio,
  };

  productos[indice] = producto;
  res.status(200).json(producto);
});

// ---------- PATCH /productos/:id ----------

app.patch("/productos/:id", (req, res) => {
  const id = parsearId(req.params.id);
  const indice = id === null ? -1 : buscarIndice(id);

  if (indice === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const body = req.body ?? {};
  const tieneNombre = body.nombre !== undefined;
  const tienePrecio = body.precio !== undefined;

  if (!tieneNombre && !tienePrecio) {
    return responder400(res, [
      "Debes enviar al menos uno de los campos: nombre o precio",
    ]);
  }

  const errores = validarProducto(body, true);

  if (errores.length > 0) {
    return responder400(res, errores);
  }

  if (tieneNombre) {
    productos[indice].nombre = body.nombre.trim();
  }

  if (tienePrecio) {
    productos[indice].precio = body.precio;
  }

  res.status(200).json(productos[indice]);
});

// ---------- DELETE /productos/:id ----------

app.delete("/productos/:id", (req, res) => {
  const id = parsearId(req.params.id);
  const indice = id === null ? -1 : buscarIndice(id);

  if (indice === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  productos.splice(indice, 1);
  res.status(204).send();
});

// ---------- Rutas y errores ----------

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido" });
  }

  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// ---------- Servidor ----------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
