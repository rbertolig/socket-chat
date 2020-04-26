//crear una clase para los usuarios del chat
//contiene lista de usuarios online con su id de socket, nombre y sala a la que se unio
class Usuarios {
    constructor() {
        this.personas = [];
    }

    // funcion que recibo el ID. nombre de un usuario y sala de char para sumarlo al listado general
    // el ID sera el del socket 
    agregarPersona(id, nombre, sala) {
        // creo un objeto con el id y el nombre recibidos
        let persona = { id, nombre, sala };
        //empujo la persona nueva en la propiedad tipo arreglo que las almacena
        this.personas.push(persona);
        //retorna un array con todos los usuarios
        return this.personas;
    }

    // retornar un usuario (persona) por su id
    getPersona(id) {
        //filtrar el array por el id. Filter retorna un array nuevo con resultado
        let persona = this.personas.filter(persona => persona.id === id)[0]; //[0] para obtener el primer elemento del arreglo
        return persona;
    }

    //retornar todos los usuarios ( personas ) 
    getPersonas() {
        return this.personas;
    }

    //eliminar un usuario ( persona ) por el id
    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);
        //filtrar el array por el id. 
        //Filter retorna un array nuevo con resultado que en este caso son todos que no coindiden con el id indicado
        this.personas = this.personas.filter(persona => persona.id != id);
        return personaBorrada;
    }

    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }


}



module.exports = {
    Usuarios
}