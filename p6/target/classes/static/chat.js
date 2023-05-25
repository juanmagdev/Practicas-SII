var websocket;
var nombre;
function conecta() {
	 websocket = new WebSocket ('ws://localhost:8080/ws');
	 websocket.onmessage = entraMensaje;
	 websocket.onopen = function () {
		 var mensaje = {
				 tipoMensaje : "ENTRADA",
				 usuario : nombre
		 };
		 websocket.send(JSON.stringify(mensaje));
		 console.log("Websocket abierto");
	 }
	 websocket.onclose = function () {
		 console.log("Websocket cerrado");
	 }
	 websocket.onerror = function () {
		 console.log("Error en Websocket")
	 }
	 
}

function entraMensaje(evento) {
	var mensaje = JSON.parse(evento.data);
	console.log(mensaje);
	escribeMensajeAreaChat(mensaje)
	
}

function escribeMensajeAreaChat(mensaje) {
	switch (mensaje.tipoMensaje) {
	case "ENTRADA":
		escribirAreaChat(">>>>>> Entra " + mensaje.usuario);
		break;
	case "SALIDA":
		escribirAreaChat("<<<<<< Sale " + mensaje.usuario);
		break;
	case "TEXTO":
		escribirAreaChat(mensaje.usuario + ": "+ mensaje.contenido);
		break;
	}
}

function escribirAreaChat(texto) {
	document.getElementById("areaChat").innerHTML += (texto +"\n"); 
}

function mandaMensaje() {
	let texto = document.getElementById("entradaTexto").value;
	let mensaje = {
			tipoMensaje : "TEXTO",
			contenido : texto,
			usuario : nombre
	};
	escribeMensajeAreaChat(mensaje);
	document.getElementById("entradaTexto").value = "";
	websocket.send(JSON.stringify(mensaje));
	console.log("Mando " + texto+ " al servidor");
}

function teclaEnEntrada(event) {
	if (event.keyCode===13) {
		event.preventDefault(); 
		mandaMensaje();
	}
}

function cierra() {
	websocket.close();
}

function entrar() {
	document.getElementById("inicio").style.display = "none";
	document.getElementById("sala").style.display = "block";
	nombre = document.getElementById("nombre").value;
	if (nombre == undefined || nombre == "") {
		console.log(nombre);
		nombre = "Anónimo";
	}
	document.getElementById("nombre").value = "";
	conecta();
}

function salir() {
	document.getElementById("inicio").style.display = "block";
	document.getElementById("sala").style.display = "none";
	document.getElementById("areaChat").innerHTML = "";
	websocket.close();
}

//window.addEventListener("load", conecta, false);
