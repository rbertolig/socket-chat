// extraer un parametro de la URL del navegador que usa este script
var params = new URLSearchParams(window.location.search);

//extraer el nombre del usuario y la sala de los parametros en la url
var nombre = params.get('nombre');
var sala = params.get('sala');

//referencias de jQuery para indexar con variables los tags y secciones de la pagina html
var divUsuarios = $('#divUsuarios'); // area con listado de usuarios online
var formEnviar = $('#formEnviar'); // formulario para envio de mensaje,contiene txtMensaje y Boton Submit
var txtMensaje = $('#txtMensaje'); // input box para escribir el mensaje
var divChatbox = $('#divChatbox'); // area para mensajes enviados y recibidos

//funciones para renderizar listado de usuarios en pagina html. 
//Recibe un array con coleccion de usuarios del chat (personas)
function renderizarUsuarios(personas) {
    //console.log(personas);

    //definir variable que ocupara string con codigo html para renderizar
    //inserto a la vez el nombre de la sala de chat leido del parametro 'sala' en la URL del cliente accesando esta pagina
    var html = ' <!-- renderizado con nombre de la Sala dinamico-->';
    html += '<li >';
    html += '   <a href = "javascript:void(0)" class = "active" > Sala: <span>' + params.get('sala') + '</span></a>';
    html += '</li>';
    //continuamos armando  el codigo html adicionando a lo anterior un barrido de todo el array con la coleccion de usuarios
    // se renderiza una linea por cada usuario con sus datos extraidos de 'personas'
    // 'data-id' sera un anchor para la linea con nombre igual al iD del socket del usuario
    //'personas[i].nombre' inserta el nombre de cada usuario en el campo html correspondiente
    html += '<!-- renderizado con listado de usuarios -->';
    for (let i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '   <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    //renderizamos pagina via jQuery cambiando el contenido html del divUsuarios en la pagina web por el html que generamos
    divUsuarios.html(html);
}

//renderizar mensajes
//owner para diferenciar la visualizacion si el mensaje es propio o de terceros
function renderizarMensajes(mensaje, owner) {

    var html = '';
    var fecha = new Date(mensaje.fecha); // extrae fecha desde timestamp en el mensaje
    var hora = fecha.getHours() + ':' + fecha.getMinutes() // extrae la hora
    var adminClass = 'inverse'; // para identificar cuando el mensaje es de administrador

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger'; // para usar una clase diferente el el DIV si es mensaje de admin
    }

    // contruir html renderizado para cada mensaje del chat box
    if (!owner) {
        // renderizar alineado a la derecha para mensajes del los demas usuarios
        html += '<li class="animated fadeIn">';
        if (adminClass !== 'danger') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        if (adminClass !== 'danger') {
            html += '    <h5>' + mensaje.nombre + '</h5>';
        }
        html += '    <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        // renderizar alineado a la izquierda para mensajes del mismo usuario
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-info">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    //anexa el html renderizado al ya existente en el div que nos interesa
    divChatbox.append(html);

}
// scrollear la ventana html de chat para que siempre este mostrando la parte de abajo ( mensajes mas recientes)
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//==============================
// listeners de jQuery
//==============================

//detectar click encima de un anchor tag y realizar accion
divUsuarios.on('click', 'a', function() {
    //obtner el ID del usuario leyendo el tag de su linea html ( lo incluimos en la renderizacion) 
    // esta en data-'id'
    var id = $(this).data('id');
    if (id) {
        console.log('ID del socket del usuario:', id);
    }
});

// capturar envio de mensaje con el'summit' del formulario
formEnviar.on('submit', function(event) { // 'e' es un evento a capturar
    //asegurar que cuando se haga summit se actualice la pagina con la nueva informacion
    event.preventDefault();
    //validar que el mensaje escrito contenga caracteres
    if (txtMensaje.val().trim().lenght === 0) {
        return;
    }

    //anunciar evento 'enviarMensaje' con usuario extraido dela url 
    //y mensaje del input 'txtMensaje' en chat.html 
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('');
        txtMensaje.focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
});