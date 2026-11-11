// rickandmorty.service.js
// Misma estructura que pokeapi.service.js, con las peticiones de la colección de Postman
const BASE_URL = "https://rickandmortyapi.com/api";

async function pedir(ruta) {
  const respuesta = await fetch(BASE_URL + ruta);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}`);
  }
  return respuesta.json();
}

// GET /character/:id
export function obtenerPersonaje(id) {
  return pedir(`/character/${id}`);
}

// GET /character?page=2&status=alive  (status: alive, dead o unknown)
export function listarPersonajes(pagina = 1, estado = "") {
  const filtroEstado = estado ? `&status=${estado}` : "";
  return pedir(`/character?page=${pagina}${filtroEstado}`);
}

// GET /character?name=smith  (ejercicio 6 de la colección)
export function buscarPersonajes(nombre) {
  return pedir(`/character?name=${encodeURIComponent(nombre)}`);
}