//requires
const express = require('express');
const path = require('path');
// inicializar express
const app = express();
//importar paquete npm 'socket.io' para manejo de sockets
const socketIO = require('socket.io');
//socket.io no se integra directo con express, sino con libreria HTTP integrada en node
//importar 'hhtp' que esta integrada en node, no es paquete npm
const http = require('http');
//dado que 'express' esta construido sobre la misma libreria 'http'
//podemos anidar el servicio 'server' que levantemos en 'http' 
//con el servicio 'app' de 'express' de esta manera:
let server = http.createServer(app);
// asi las configuraciones que hagamos en 'app' de express se heredan en 'server'

// definir ruta de la carpeta /public para hacerla publica
const publicPath = path.resolve(__dirname, '../public');
// hacer publica la carpeta /public con el siguiente comando y su ruta literal
app.use(express.static(publicPath));
//definir el puerto para nuestro servidor
const port = process.env.PORT || 3000;

//inicializar 'socket.io'
//esto habilita la funcionalidad de comunicacion con sockets en el backend
let io = socketIO(server);
module.exports = { io }; //para poder poner todo el codigo de la logica de sockets en '/sockets/socket.js'
//tambien se puede exportar con otra sintaxis en lugar de 'let': 
//module.exports.io = socketIO(server);

// insertar toda la logica de sockets desarrollada en '/sockets/socket.js'
require('./sockets/socket');

/**
// subir el servidor en el puerto del servicio
// notar que es 'server' y no 'app'aunque estan anidados.
// esto porque la libreria 'socket.oi' requiere que el servidor 
//este construido directamente sobre'http' y no sobre 'express'
**/
server.listen(port, (err) => {
    // siay error indicarlo
    if (err) throw new Error(err);
    //anunciar en la consola que el servidor esta online y escuchando peticiones
    console.log(`Servidor corriendo en puerto ${ port }`);
});