package es.uma.informatica.sii.practica2;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.web.util.DefaultUriBuilderFactory;
import org.springframework.web.util.UriBuilder;
import org.springframework.web.util.UriBuilderFactory;

import es.uma.informatica.sii.practica2.entidades.Contacto;
import es.uma.informatica.sii.practica2.repositorios.ContactoRepo;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@DisplayName("En el servicio de agenda")
@DirtiesContext(classMode = ClassMode.AFTER_EACH_TEST_METHOD)
public class Practica2ApplicationTests {
	@Autowired
	private TestRestTemplate restTemplate;
	
	@Value(value="${local.server.port}")
	private int port;
	
	@Autowired
	private ContactoRepo contactoRepository;
	
	@BeforeEach
	public void initializeDatabase() {
		contactoRepository.deleteAll();
	}
	
	private URI uri(String scheme, String host, int port, String ...paths) {
		UriBuilderFactory ubf = new DefaultUriBuilderFactory();
		UriBuilder ub = ubf.builder()
				.scheme(scheme)
				.host(host).port(port);
		for (String path: paths) {
			ub = ub.path(path);
		}
		return ub.build();
	}
	
	private RequestEntity<Void> get(String scheme, String host, int port, String path) {
		URI uri = uri(scheme, host,port, path);
		var peticion = RequestEntity.get(uri)
			.accept(MediaType.APPLICATION_JSON)
			.build();
		return peticion;
	}
	
	private RequestEntity<Void> delete(String scheme, String host, int port, String path) {
		URI uri = uri(scheme, host,port, path);
		var peticion = RequestEntity.delete(uri)
			.build();
		return peticion;
	}
	
	private <T> RequestEntity<T> post(String scheme, String host, int port, String path, T object) {
		URI uri = uri(scheme, host,port, path);
		var peticion = RequestEntity.post(uri)
			.contentType(MediaType.APPLICATION_JSON)
			.body(object);
		return peticion;
	}
	
	private <T> RequestEntity<T> put(String scheme, String host, int port, String path, T object) {
		URI uri = uri(scheme, host,port, path);
		var peticion = RequestEntity.put(uri)
			.contentType(MediaType.APPLICATION_JSON)
			.body(object);
		return peticion;
	}
	
	private void compruebaCampos(Contacto expected, Contacto actual) {
		assertThat(actual.getApellidos()).isEqualTo(expected.getApellidos());
		assertThat(actual.getNombre()).isEqualTo(expected.getNombre());
		assertThat(actual.getTelefono()).isEqualTo(expected.getTelefono());
		assertThat(actual.getEmail()).isEqualTo(expected.getEmail());
	}
	
	
	@Nested
	@DisplayName("cuando la agenda está vacía")
	public class ListaVacia {
		
		@Test
		@DisplayName("devuelve la lista de contactos vacía")
		public void devuelveLista() {
			
			var peticion = get("http", "localhost",port, "/api/agenda/contactos");
			
			var respuesta = restTemplate.exchange(peticion,
					new ParameterizedTypeReference<List<Contacto>>() {});
			
			assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
			assertThat(respuesta.getBody()).isEmpty();
		}
		
		@Nested
		@DisplayName("inserta un contacto")
		public class InsertaContactos {
			@Test
			@DisplayName("sin ID")
			public void sinID() {
				Contacto contacto = new Contacto(null, 
						"Antonio", 
						"García", 
						"antonio@uma.es", 
						"123456789");
				var peticion = post("http", "localhost", port, "/api/agenda/contactos", contacto);
				
				var respuesta = restTemplate.exchange(peticion, Void.class);
				
				compruebaRespuesta(contacto, respuesta);
			}

			private void compruebaRespuesta(Contacto contacto, ResponseEntity<Void> respuesta) {
				assertThat(respuesta.getStatusCode().value()).isEqualTo(201);
				assertThat(respuesta.getHeaders().get("Location").get(0))
					.startsWith("http://localhost:"+port+"/api/agenda/contactos");
				
				List<Contacto> contactos = contactoRepository.findAll();
				assertThat(contactos).hasSize(1);
				assertThat(respuesta.getHeaders().get("Location").get(0))
					.endsWith("/"+contactos.get(0).getId());
				compruebaCampos(contacto, contactos.get(0));
			}
			
			@Test
			@DisplayName("a pesar de que tenga ID")
			public void conID() {
				Contacto contacto = new Contacto(
						3L, 
						"Antonio", 
						"García", 
						"antonio@uma.es", 
						"123456789");
				var peticion = post("http", "localhost", port, "/api/agenda/contactos", contacto);
				
				var respuesta = restTemplate.exchange(peticion, Void.class);
				
				compruebaRespuesta(contacto, respuesta);
			}
		}
		
		@Test
		@DisplayName("devuelve error cuando se pide un contacto concreto")
		public void devuelveErrorAlConsultarContacto() {
			var peticion = get("http", "localhost",port, "/api/agenda/contactos/1");
			
			var respuesta = restTemplate.exchange(peticion, Void.class);
			
			assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
			assertThat(respuesta.hasBody()).isEqualTo(false);	
		}
		
		@Test
		@DisplayName("devuelve error cuando se modifica un contacto concreto")
		public void devuelveErrorAlModificarContacto() {
			Contacto contacto = new Contacto(
					3L, 
					"Antonio", 
					"García", 
					"antonio@uma.es", 
					"123456789");
			var peticion = put("http", "localhost",port, "/api/agenda/contactos/1", contacto);
			
			var respuesta = restTemplate.exchange(peticion, Void.class);
			
			assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
		}
		
		@Test
		@DisplayName("devuelve error cuando se elimina un contacto concreto")
		public void devuelveErrorAlEliminarContacto() {
			var peticion = delete("http", "localhost",port, "/api/agenda/contactos/1");
			
			var respuesta = restTemplate.exchange(peticion, Void.class);
			
			assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
		}
	}
	
	@Nested
	@DisplayName("cuando la agenda tiene datos")
	public class ListaConDatos {
		@BeforeEach
		public void introduceDatos() {
			contactoRepository.save(new Contacto(null,"Antonio", 
						"García", "antonio@uma.es", "123456789"));
			contactoRepository.save(new Contacto(null,"Victoria", 
					"Rodríguez", "victoria@uma.es", "987654321"));
		}
		
		@Test
		@DisplayName("devuelve la lista de contactos correctamente")
		public void devuelveLista() {
			var peticion = get("http", "localhost",port, "/api/agenda/contactos");
			
			var respuesta = restTemplate.exchange(peticion,
					new ParameterizedTypeReference<List<Contacto>>() {});
			
			assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
			assertThat(respuesta.getBody()).hasSize(2);
		}
		
		@Nested
		@DisplayName("inserta un contacto")
		public class InsertaContactos {
			@Test
			@DisplayName("sin ID")
			public void sinID() {
				Contacto contacto = new Contacto(null, 
						"Sonia", 
						"Ramos", 
						"sonia@uma.es", 
						"123454321");
				var peticion = post("http", "localhost", port, "/api/agenda/contactos", contacto);
				
				var respuesta = restTemplate.exchange(peticion, Void.class);
				
				compruebaRespuesta(contacto, respuesta);
			}
			@Test
			@DisplayName("a pesar de que tenga ID")
			public void conIDNoExistente() {
				Contacto contacto = new Contacto(
						28L, 
						"Sonia", 
						"Ramos", 
						"sonia@uma.es", 
						"123454321");
				var peticion = post("http", "localhost", port, "/api/agenda/contactos", contacto);
				
				var respuesta = restTemplate.exchange(peticion, Void.class);
				
				compruebaRespuesta(contacto, respuesta);
			}
			@Test
			@DisplayName("a pesar de que el ID coincida con uno existente")
			public void conIDExistente() {
				Contacto contacto = new Contacto(
						1L, 
						"Sonia", 
						"Ramos", 
						"sonia@uma.es", 
						"123454321");
				var peticion = post("http", "localhost", port, "/api/agenda/contactos", contacto);
				
				var respuesta = restTemplate.exchange(peticion, Void.class);
				
				compruebaRespuesta(contacto, respuesta);
			}
			
			private void compruebaRespuesta(Contacto contacto, ResponseEntity<Void> respuesta) {
				assertThat(respuesta.getStatusCode().value()).isEqualTo(201);
				assertThat(respuesta.getHeaders().get("Location").get(0))
					.startsWith("http://localhost:"+port+"/api/agenda/contactos");
				
				List<Contacto> contactos = contactoRepository.findAll();
				assertThat(contactos).hasSize(3);
				
				Contacto sonia = contactos.stream()
						.filter(c->c.getNombre().equals("Sonia"))
						.findAny()
						.get();
				
				assertThat(respuesta.getHeaders().get("Location").get(0))
					.endsWith("/"+sonia.getId());
				compruebaCampos(contacto, sonia);
			}
		}
		
		@Nested
		@DisplayName("al consultar un contacto concreto")
		public class ObtenerContactos {
			@Test
			@DisplayName("lo devuelve cuando existe")
			public void devuelveContacto() {
				var peticion = get("http", "localhost",port, "/api/agenda/contactos/1");
				
				var respuesta = restTemplate.exchange(peticion,Contacto.class);
				
				assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
				assertThat(respuesta.hasBody()).isEqualTo(true);
				assertThat(respuesta.getBody()).isNotNull();
			}
			
			@Test
			@DisplayName("da error cuando no existe")
			public void errorCuandoContactoNoExiste() {
				var peticion = get("http", "localhost",port, "/api/agenda/contactos/28");
				
				var respuesta = restTemplate.exchange(peticion,
						new ParameterizedTypeReference<List<Contacto>>() {});
				
				assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
				assertThat(respuesta.hasBody()).isEqualTo(false);
			}
		}
		
		@Nested
		@DisplayName("al modificar un contacto")
		public class ModificarContactos {
			@Test
			@DisplayName("lo modifica correctamente cuando existe")
			@DirtiesContext
			public void modificaCorrectamente() {
				Contacto contacto = new Contacto(
						null, 
						"Sonia", 
						"Ramos", 
						"sonia@uma.es", 
						"123454321");
				var peticion = put("http", "localhost",port, "/api/agenda/contactos/1", contacto);
				
				var respuesta = restTemplate.exchange(peticion,Void.class);
				
				assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
				Contacto contactoBD = contactoRepository.findById(1L).get();
				compruebaCampos(contacto, contactoBD);
			}
			@Test
			@DisplayName("da error cuando no existe")
			public void errorCuandoNoExiste() {
				Contacto contacto = new Contacto(
						null, 
						"Sonia", 
						"Ramos", 
						"sonia@uma.es", 
						"123454321");
				var peticion = put("http", "localhost",port, "/api/agenda/contactos/28", contacto);
				
				var respuesta = restTemplate.exchange(peticion,Void.class);
				
				assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
				assertThat(respuesta.hasBody()).isEqualTo(false);
			}
		}
		
		@Nested
		@DisplayName("al eliminar un contacto")
		public class EliminarContactos {
			@Test
			@DisplayName("lo elimina cuando existe")
			public void eliminaCorrectamente() {
				List<Contacto> contactosantes = contactoRepository.findAll();
				contactosantes.forEach(c->System.out.println(c));
				var peticion = delete("http", "localhost",port, "/api/agenda/contactos/1");
				
				var respuesta = restTemplate.exchange(peticion,Void.class);
				
				assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
				List<Contacto> contactos = contactoRepository.findAll();
				assertThat(contactos).hasSize(1);
				assertThat(contactos).allMatch(c->c.getId()!=1);
			}
			
			@Test
			@DisplayName("da error cuando no existe")
			public void errorCuandoNoExiste() {
				var peticion = delete("http", "localhost",port, "/api/agenda/contactos/28");
				
				var respuesta = restTemplate.exchange(peticion,Void.class);
				
				assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
				assertThat(respuesta.hasBody()).isEqualTo(false);
			}
		}
		
		
		
	}
	
}
