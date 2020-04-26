//=======================================================
// script para comunicacion con el servidor.
// contiene codigo para usar del lado 'cliente remoto'
//=======================================================

// levantar un socket desde este cliente hacia el servidor usando el servicio 'io'
// primero: definir objeto para el socket
var socket = io();

// extraer un parametro de la URL del navegador que usa este script
var params = new URLSearchParams(window.location.search);
//si la url no tieneel parametro deseado ('nombre')
if (!params.has('nombre') || !params.has('sala')) {
    //redireccionar el navegador a pagina index.html y lanzar error
    window.location = 'index.html'
    throw new Error('El Nombre y la Sala son necesarios')
}

//definir objeto 'usuario' que almacenara parametro extraido de la url
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

// Manejar evento de conexion al socket
socket.on('connect', function() {
    //confirmar en consola la conexion establecida 
    console.log('Servidor: ON-LINE');

    //anunciar entrada de usuario con evento 'entrarChat' y pasar datos del usuario
    socket.emit('entrarChat', usuario, (resp) => {

    });
});

//capturar perdida de conexion con el servidor de esta manera
socket.on('disconnect', function() {
    //confirmar en consola la conexion perdida 
    console.log('Servidor: OFF-LINE');
});

// //activar evento 'enviarMensaje'
// socket.emit('crearMensaje', {
//     usuario: '',
//     mensaje: 'Hola Mundo'
//         // capturar 'resp' que es enviada por el servidor luego de recibir este mensaje
// }, function(resp) {
//     console.log(resp);
// });

// Escuchar evento 'crearMensaje'
socket.on('crearMensaje', (mensaje) => {
    console.log('Mensaje recibido:', mensaje);
});

//escuchar envento que anuncia cambios en colecion de usuarios conectados
//cuando un usuario entra o sale del chat
socket.on('listaPersona', function(resp) {
    console.log(resp);
});

//escuchar evento pararecibir mensaje privado
socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje Privado:', mensaje);
});