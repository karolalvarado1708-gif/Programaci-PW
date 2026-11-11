const url = "https://pokeapi.co/api/v2/pokemon/pikachu";

async function main() {
    const respuesta = await fetch(url);

    console.log("codigo: " + respuesta.status);
    console.log("ok?: " + respuesta.ok);

    if (!respuesta.ok) {
        console.log("EL POKEMON NO EXISTE");
        return;
    }

    const data = await respuesta.json();

    console.log("nombre: " + data.name);


    console.log("altura: " + data.height);
    console.log("abilidad: " + data.abilities[0].ability.name);
    console.log("tipo: " + data.types[0].type.name);
    console.log("peso: " + data.weight);
}
main();