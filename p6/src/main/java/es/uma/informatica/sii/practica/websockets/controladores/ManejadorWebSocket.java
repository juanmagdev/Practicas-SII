package es.uma.informatica.sii.practica.websockets.controladores;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Logger;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import es.uma.informatica.sii.practica.websockets.dtos.Mensaje;
import es.uma.informatica.sii.practica.websockets.dtos.Mensaje.TipoMensaje;

public class ManejadorWebSocket extends TextWebSocketHandler {
	private static final Logger LOGGER = Logger.getLogger(ManejadorWebSocket.class.getCanonicalName());

	private Map<WebSocketSession, String> clientes = Collections.synchronizedMap(new HashMap<>());
	private AtomicInteger ultimo = new AtomicInteger(1);

	@Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String nombreUsuario = clientes.get(session);
        clientes.remove(session);

        Mensaje mensaje = new Mensaje();
        mensaje.setTipoMensaje(TipoMensaje.SALIDA);
        mensaje.setUsuario(nombreUsuario);

        notificar(session, mensaje);
    }

	/**
	 * Este método se llama cuando llega un mensaje por un Websocket.
	 */
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

		ObjectMapper om = new ObjectMapper();
		Mensaje mensaje = om.readValue(message.getPayload(), Mensaje.class);
		String nombreUsuario = mensaje.getUsuario();

		// Si el nombre de usuario no está establecido, asignamos uno nuevo.
		if (nombreUsuario == null || nombreUsuario.trim().isEmpty()) {
			nombreUsuario = nuevoNombre();
		}

		// Actualizar el mapa de clientes con el nuevo nombre de usuario.
		clientes.put(session, nombreUsuario);

		mensaje.setUsuario(nombreUsuario);
		notificar(session, mensaje);
	}

	/**
	 * Este método devuelve un nombre anónimo exclusivo, para el caso en que no
	 * envíen
	 * ningún nombre desde el frontend
	 * 
	 * @return Un nombre anónimo para el usuario
	 */
	private String nuevoNombre() {
		int valor = ultimo.getAndAdd(1);
		return "Anónimo " + valor;
	}

	/**
	 * Este método manda un mensaje serializado en JSON a todos los clientes de
	 * Websocket menos a
	 * aquél que está represntado por el objeto session que se pasa por argumento.
	 * 
	 * @param session: Objeto que representa la conexión con el cliente que no hay
	 *                 que
	 *                 notificar (porque ha enviado el evento que produce esta
	 *                 notificación)
	 * @param mensaje: Mensaje a enviar
	 */
	private void notificar(WebSocketSession session, Mensaje mensaje) {
		ObjectMapper om = new ObjectMapper();
		clientes.keySet().forEach(s -> {
			if (s != session && s.isOpen()) {
				try {
					s.sendMessage(new TextMessage(om.writeValueAsString(mensaje)));
				} catch (IOException e) {
					LOGGER.warning("Error al enviar: " + e.getLocalizedMessage());
				}
			}
		});
	}

}
