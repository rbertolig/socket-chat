// esta es una forma de hacer una libreria de funciones a reutilizar

//funcion para consctruir elobjeto de un mensaje
const crearMensaje = (nombre, mensaje) => {
    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };
}

module.exports = {
    crearMensaje
}