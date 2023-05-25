package es.uma.informatica.sii.practica.websockets.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import es.uma.informatica.sii.practica.websockets.controladores.ManejadorWebSocket;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(manejador(), "/ws")
			.setAllowedOrigins("*");
	}
	
	@Bean
	public ManejadorWebSocket manejador() {
		return new ManejadorWebSocket();
	}

}
