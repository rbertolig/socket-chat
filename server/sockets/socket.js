//=================================
// Implementacion de los sockets
//=================================

//importar io desde server.js declarado alla con 'module.exports'
const { io } = require('../server');

//importar 'clase' Usuarios
const { Usuarios } = require('../classes/usuarios');

//importar libreria de utilidades
const { crearMensaje } = require('../utilidades/utilidades');

//crear un nuevo objeto de la clase Usuarios ( coleccion de usuarios conectados)
const usuarios = new Usuarios();

//para capturtar el evento cuando se conectan ( reconectan ) clientes remotos al socket se usa: el tag 'connection'
io.on('connection', (client) => {
    // toda la comunicacion se implementa dentro de un lazo 'io.on()'
    console.log('Cliente remoto ON-LINE'); // confirmar conexion de nuevo cliente

    //manaejar evento 'entrarChat' del lado servidor
    client.on('entrarChat', (usuario, callback) => {
        // validar llamada al evento con callback
        if (!callback) return;
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                messaje: 'Debe especificar un Nombre de usuario y Sala'
            });
        }
        //registrar el usuario que se conecto a la sala correspondiente
        // el nombre de la sala sera el mismo literal que digito el usuario en index.html
        //.join() se ejecuta a nivel de sockets , no de la logica de nuestra app
        client.join(usuario.sala);

        //agregar el nuevo usuario a la coleccion general de usuarios online ( clase Usuario)
        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        //obtener listado de usuarios que estan en la sala del nuevo usuario
        let personas = usuarios.getPersonasPorSala(usuario.sala);

        //activar evento que anuncia las personas conectadas filtrado por sala
        client.broadcast.to(usuario.sala).emit('listaPersona', personas);
        //anunciar que se conecto nuevo usuario
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuario.nombre} se unio al chat`));


        //retornar todas las personas online filtradas por sala
        callback(personas);
    });

    //capturar evento 'crearMensaje'. EL mensaje del cliente se recibe en 'data'
    client.on('crearMensaje', (data, callback) => {

        //obtener el usuario que activo este evento mediante el id de su socket
        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        //validar emits con callback para evitar crash
        if (!callback) return;
        callback(mensaje);
    });

    //capturar evento de desconexion de las instancias de sockets
    // esto evita duplicidad en nuestro registro de usuarios cuando se recarga el navegador
    client.on('disconnect', () => {
        //llamar funcion de que elimina de la clase Usuarios el se haya desconectado
        let personaBorrada = usuarios.borrarPersona(client.id);
        if (!personaBorrada) return;
        //anunciar con evento 'crearMensaje' el usuario que se desconecto
        //.to() filtra el emit para la sala o el usuario que se indique
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio del chat`));
        //activar evento que anuncia las personas conectadas 
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('mensajePrivado', (data) => {
        if (!data) return;
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});