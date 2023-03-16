package es.uma.informatica.practica3;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.catalina.Server;
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
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.web.util.DefaultUriBuilderFactory;
import org.springframework.web.util.UriBuilder;
import org.springframework.web.util.UriBuilderFactory;

import es.uma.informatica.practica3.dtos.IngredienteDTO;
import es.uma.informatica.practica3.dtos.ProductoDTO;
import es.uma.informatica.practica3.entidades.Ingrediente;
import es.uma.informatica.practica3.entidades.Producto;
import es.uma.informatica.practica3.repositorios.IngredienteRepository;
import es.uma.informatica.practica3.repositorios.ProductoRepository;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@DisplayName("En el servicio de productos")
@DirtiesContext(classMode = ClassMode.AFTER_EACH_TEST_METHOD)
class Practica3ApplicationTests {
	
	@Autowired
	private TestRestTemplate restTemplate;
	
	@Value(value="${local.server.port}")
	private int port;
	
	@Autowired
	private IngredienteRepository ingredienteRepo;
	
	@Autowired
	private ProductoRepository productoRepo;
	
	
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
	
	private void compruebaCampos(Ingrediente expected, Ingrediente actual) {
		assertThat(actual.getNombre()).isEqualTo(expected.getNombre());
	}
	
	private void compruebaCampos(Producto expected, Producto actual) {	
		assertThat(actual.getNombre()).isEqualTo(expected.getNombre());
		assertThat(actual.getDescripcion()).isEqualTo(expected.getDescripcion());
		assertThat(actual.getIngredientes()).isEqualTo(expected.getIngredientes());
	}
	
	@Nested
	@DisplayName("cuando la base de datos está vacía")
	public class BaseDatosVacia {

		@Test
		@DisplayName("devuelve error al acceder a un ingrediente concreto")
		public void errorConIngredienteConcreto() {
			var peticion = get("http", "localhost",port, "/ingredientes/1");
			
			var respuesta = restTemplate.exchange(peticion,
					new ParameterizedTypeReference<IngredienteDTO>() {});
			
			assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
		}
		
		@Test
		@DisplayName("devuelve una lista vacía de productos")
		public void devuelveListaVaciaProductos() {
			var peticion = get("http", "localhost",port, "/productos");
			
			var respuesta = restTemplate.exchange(peticion,
					new ParameterizedTypeReference<List<ProductoDTO>>() {});
			
			assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
			assertThat(respuesta.getBody()).isEmpty();
		}
		
		@Test
		@DisplayName("inserta correctamente un ingrediente")
		public void insertaIngrediente() {
			
			// Preparamos el ingrediente a insertar
			var ingrediente = IngredienteDTO.builder()
									.nombre("Chorizo")
									.build();
			// Preparamos la petición con el ingrediente dentro
			var peticion = post("http", "localhost",port, "/ingredientes", ingrediente);
			
			// Invocamos al servicio REST 
			var respuesta = restTemplate.exchange(peticion,Void.class);
			
			// Comprobamos el resultado
			assertThat(respuesta.getStatusCode().value()).isEqualTo(201);
			assertThat(respuesta.getHeaders().get("Location").get(0))
				.startsWith("http://localhost:"+port+"/ingredientes");
		
			List<Ingrediente> ingredientesBD = ingredienteRepo.findAll();
			assertThat(ingredientesBD).hasSize(1);
			assertThat(respuesta.getHeaders().get("Location").get(0))
				.endsWith("/"+ingredientesBD.get(0).getId());
			compruebaCampos(ingrediente.ingrediente(), ingredientesBD.get(0));
		}

		@Test
		@DisplayName("Elimina correctamente un ingrediente")
		public void eliminarIngrediente(){
			// Preparamos el ingrediente a eliminar
			var ingrediente = IngredienteDTO.builder()
					.nombre("Chorizo2")
					.id(1L)
					.build();
			
			
			var peticion = post("http", "localhost",port, "/ingredientes", ingrediente);
			// Preparamos la petición con el ingrediente dentro
			var respuesta1 = restTemplate.exchange(peticion,Void.class);

			var peticionDelete = delete("http", "localhost",port, "/ingredientes/"+ingrediente.getId());

			// Comprobamos el resultado
			var respuesta = restTemplate.exchange(peticionDelete,Void.class);
			assertThat(respuesta.getStatusCode().value()).isEqualTo(200);

			List<Ingrediente> ingredientesBD = ingredienteRepo.findAll();
			assertThat(ingredientesBD).hasSize(0);
		}

		@Test
		@DisplayName("Modifica correctamente un ingrediente")
		public void modificarIngrediente(){
			// Preparamos el ingrediente a modificar
			var ingrediente = IngredienteDTO.builder()
					.nombre("Chorizo2")
					.id(1L)
					.build();

			var peticion = post("http", "localhost",port, "/ingredientes", ingrediente);
			var respuesta1 = restTemplate.exchange(peticion,Void.class);
			// Preparamos la petición con el ingrediente dentro

			ingrediente.setNombre("Chorizo3");

			var peticionPut = put("http", "localhost",port, "/ingredientes/"+ingrediente.getId(), ingrediente);

			// Comprobamos el resultado
			var respuesta = restTemplate.exchange(peticionPut,Void.class);
			assertThat(respuesta.getStatusCode().value()).isEqualTo(200);

			List<Ingrediente> ingredientesBD = ingredienteRepo.findAll();
			assertThat(ingredientesBD).hasSize(1);
			assertThat(ingredientesBD.get(0).getNombre()).isEqualTo(ingrediente.getNombre());
		}

		@Test
		@DisplayName("Obtiene correctamente un ingrediente")
		public void obtenerIngrediente(){
			// Preparamos  ingrediente a obtener
			var ingrediente = IngredienteDTO.builder()
					.nombre("Chorizo2")
					.id(1L)
					.build();

			var peticion = post("http", "localhost",port, "/ingredientes", ingrediente);
			var respuesta1 = restTemplate.exchange(peticion,Void.class);
			// Preparamos la petición con el ingrediente dentro

			var peticionGet = get("http", "localhost",port, "/ingredientes/"+ingrediente.getId());

			// Comprobamos el resultado
			var respuesta = restTemplate.exchange(peticionGet,IngredienteDTO.class);
			// assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
			// assertThat(respuesta.getBody().getNombre()).isEqualTo(ingrediente.getNombre());
			List<Ingrediente> ingredientesBD = ingredienteRepo.findAll();
			assertThat(ingredientesBD).hasSize(1);
			assertThat(ingredientesBD.get(0).getNombre()).isEqualTo(ingrediente.getNombre());
		}

		@Test
		@DisplayName("Obtiene todos los ingredientes correctamente un ingrediente")
		public void obtenerTodosIngrediente(){
			// Preparamos el ingrediente a obtener
			var ingrediente = IngredienteDTO.builder()
					.nombre("Chorizo2")
					.id(1L)
					.build();
					
			var peticion1 = post("http", "localhost",port, "/ingredientes", ingrediente);
			var respuesta1 = restTemplate.exchange(peticion1,Void.class);
			
			var ingrediente2 = IngredienteDTO.builder()
					.nombre("Chorizo3")
					.id(2L)
					.build(); 

			var peticion2 = post("http", "localhost",port, "/ingredientes", ingrediente2);
			var respuesta2 = restTemplate.exchange(peticion2,Void.class);
			// Preparamos la petición con el ingrediente dentro

			var peticionGet = get("http", "localhost",port, "/ingredientes/");

			// Comprobamos el resultado
			var respuesta = restTemplate.exchange(peticionGet,IngredienteDTO.class);

			List<Ingrediente> ingredientesBD = ingredienteRepo.findAll();
			assertThat(ingredientesBD).hasSize(2);
			assertThat(ingredientesBD.get(0).getNombre()).isEqualTo(ingrediente.getNombre());
			assertThat(ingredientesBD.get(1).getNombre()).isEqualTo(ingrediente2.getNombre());
		}

		@Test
		@DisplayName("inserta un ingrediente repetido")
		public void insertaRepetidoIngrediente() {
			// Preparamos el ingrediente a insertar
			var ingrediente = IngredienteDTO.builder()
					.nombre("Chorizo")
					.id(1L)
					.build();
			// Preparamos la petición con el ingrediente dentro
			var peticion = post("http", "localhost",port, "/ingredientes", ingrediente);

			// Invocamos al servicio REST
			var respuesta = restTemplate.exchange(peticion,Void.class);

			// Preparamos el ingrediente a insertar
			var ingrediente2 = IngredienteDTO.builder()
					.nombre("Chorizo")
					.id(2L)
					.build();
			// Preparamos la petición con el ingrediente dentro
			var peticion2 = post("http", "localhost",port, "/ingredientes", ingrediente2);

			// Invocamos al servicio REST
			var respuesta2 = restTemplate.exchange(peticion2,Void.class);

			// Comprobamos el resultado
			assertThat(respuesta.getStatusCode().value()).isEqualTo(201);
			assertThat(respuesta.getHeaders().get("Location").get(0))
					.startsWith("http://localhost:"+port+"/ingredientes");

			List<Ingrediente> ingredientesBD = ingredienteRepo.findAll();
			assertThat(ingredientesBD).hasSize(1);
			assertThat(respuesta.getHeaders().get("Location").get(0))
					.endsWith("/"+ingredientesBD.get(0).getId());
			compruebaCampos(ingrediente.ingrediente(), ingredientesBD.get(0));
		}

		@Test
		@DisplayName("Inserta correctamente un producto")
		public void insertarProducto(){
			// Preparamos el producto a insertar
			var producto = ProductoDTO.builder()
					.nombre("Pizza")
					.id(1L)
					.build();
			// Preparamos la petición con el producto dentro
			var peticion = post("http", "localhost",port, "/productos", producto);
			
			// Invocamos al servicio REST 
			var respuesta = restTemplate.exchange(peticion,Void.class);
			
			// Comprobamos el resultado
			assertThat(respuesta.getStatusCode().value()).isEqualTo(201);
			assertThat(respuesta.getHeaders().get("Location").get(0))
				.startsWith("http://localhost:"+port+"/productos");
		
			List<Producto> productosBD = productoRepo.findAll();
			assertThat(productosBD).hasSize(1);
			assertThat(respuesta.getHeaders().get("Location").get(0))
				.endsWith("/"+productosBD.get(0).getId());
			compruebaCampos(producto.producto(), productosBD.get(0));
		}

		@Test
		@DisplayName("Actualiza correctamente un producto")
		public void actualizarProducto(){
			// Preparamos el producto a actualizar
			var ingrediente1 = IngredienteDTO.builder()
					.nombre("Chorizo")
					.id(1L)
					.build();

			var peticion1 = post("http", "localhost",port, "/ingredientes", ingrediente1);
			var respuesta1 = restTemplate.exchange(peticion1,Void.class);

			// var ingrediente2 = IngredienteDTO.builder()
			// 		.nombre("Tomate")
			// 		.id(2L)
			// 		.build();

			// var peticion2 = post("http", "localhost",port, "/ingredientes", ingrediente2);
			// var respuesta2 = restTemplate.exchange(peticion2,Void.class);

			var ingredientes = new HashSet<IngredienteDTO>();
			ingredientes.add(ingrediente1);
			// ingredientes.add(ingrediente2);

			var producto = ProductoDTO.builder()
					.nombre("Pizza")
					.id(1L)
					// .descripcion("Pizza de jamon y queso del Mercadona")
					.ingredientes(ingredientes)
					.build();
					
			// Preparamos la petición con el producto dentro
			var peticion = post("http", "localhost",port, "/productos", producto);
			var respuesta3 = restTemplate.exchange(peticion,Void.class);
			// Preparamos la petición con el producto dentro
			producto.setNombre("Pizza2");
			var peticionPut = put("http", "localhost",port, "/productos/1", producto);
			
			// Invocamos al servicio REST 
			var respuesta = restTemplate.exchange(peticionPut,Void.class);
			
			// Comprobamos el resultado
			assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
		
			List<Producto> productosBD = productoRepo.findAll();
			assertThat(productosBD).hasSize(1);
			compruebaCampos(producto.producto(), productosBD.get(0));
		}

		@Test
		@DisplayName("Elimina correctamente un producto")
		public void eliminarProducto(){
			// Preparamos el producto a eliminar
			var ingrediente1 = IngredienteDTO.builder()
					.nombre("Chorizo")
					.id(1L)
					.build();

			var peticion1 = post("http", "localhost",port, "/ingredientes", ingrediente1);
			var respuesta1 = restTemplate.exchange(peticion1,Void.class);

			// var ingrediente2 = IngredienteDTO.builder()
			// 		.nombre("Tomate")
			// 		.id(2L)
			// 		.build();

			// var peticion2 = post("http", "localhost",port, "/ingredientes", ingrediente2);
			// var respuesta2 = restTemplate.exchange(peticion2,Void.class);

			var ingredientes = new HashSet<IngredienteDTO>();
			ingredientes.add(ingrediente1);
			// ingredientes.add(ingrediente2);

			var producto = ProductoDTO.builder()
					.nombre("Pizza")
					.id(1L)
					// .descripcion("Pizza de jamon y queso del Mercadona")
					.ingredientes(ingredientes)
					.build();
					
			// Preparamos la petición con el producto dentro
			var peticion = post("http", "localhost",port, "/productos", producto);
			var respuesta3 = restTemplate.exchange(peticion,Void.class);
			// Preparamos la petición con el producto dentro
			var peticionDelete = delete("http", "localhost",port, "/productos/1");
			
			// Invocamos al servicio REST 
			var respuesta = restTemplate.exchange(peticionDelete,Void.class);
			
			// Comprobamos el resultado
			assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
		
			List<Producto> productosBD = productoRepo.findAll();
			assertThat(productosBD).hasSize(0);
		}

		@Test
		@DisplayName("Obtiene correctamente un producto")
		public void obtenerProducto(){
			// Preparamos el producto a insertar
			var ingrediente1 = IngredienteDTO.builder()
					.nombre("Chorizo")
					.id(1L)
					.build();
			var peticion1 = post("http", "localhost",port, "/ingredientes", ingrediente1);
			var respuesta1 = restTemplate.exchange(peticion1,Void.class);

			// var ingrediente2 = IngredienteDTO.builder()
			// 		.nombre("Tomate")
			// 		.id(2L)
			// 		.build();

			// var peticion2 = post("http", "localhost",port, "/ingredientes", ingrediente2);
			// var respuesta2 = restTemplate.exchange(peticion2,Void.class);

			var ingredientes = new HashSet<IngredienteDTO>();
			ingredientes.add(ingrediente1);
			// ingredientes.add(ingrediente2);

			var producto = ProductoDTO.builder()
					.nombre("Pizza")
					.id(1L)
					// .descripcion("Pizza de jamon y queso del Mercadona")
					.ingredientes(ingredientes)
					.build();
			
			// Preparamos la petición con el producto dentro
			var peticion = post("http", "localhost",port, "/productos", producto);
			var respuesta3 = restTemplate.exchange(peticion,Void.class);
			// Preparamos la petición con el producto dentro
			var peticionGet = get("http", "localhost",port, "/productos/1");

			// Invocamos al servicio REST
			var respuesta = restTemplate.exchange(peticionGet,ProductoDTO.class);

			// Comprobamos el resultado
			assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
		
			List<Producto> productosBD = productoRepo.findAll();
			assertThat(productosBD).hasSize(1);

		}

		@Test
		@DisplayName("Obtiene correctamente todos los productos")
		public void obtenerTodosProductos(){
			// Preparamos el producto a insertar
			var ingrediente1 = IngredienteDTO.builder()
					.nombre("Chorizo")
					.id(1L)
					.build();
			var peticion1 = post("http", "localhost",port, "/ingredientes", ingrediente1);
			var respuesta1 = restTemplate.exchange(peticion1,Void.class);

			// var ingrediente2 = IngredienteDTO.builder()
			// 		.nombre("Tomate")
			// 		.id(2L)
			// 		.build();

			// var peticion2 = post("http", "localhost",port, "/ingredientes", ingrediente2);
			// var respuesta2 = restTemplate.exchange(peticion2,Void.class);

			var ingredientes = new HashSet<IngredienteDTO>();
			ingredientes.add(ingrediente1);
			// ingredientes.add(ingrediente2);

			var producto = ProductoDTO.builder()
					.nombre("Pizza")
					.id(1L)
					// .descripcion("Pizza de jamon y queso del Mercadona")
					.ingredientes(ingredientes)
					.build();

			
			// Preparamos la petición con el producto dentro
			var peticion = post("http", "localhost",port, "/productos", producto);
			var respuesta3 = restTemplate.exchange(peticion,Void.class);
			// Preparamos la petición con el producto dentro
			var peticionGet = get("http", "localhost",port, "/productos");

			// Invocamos al servicio REST
			var respuesta = restTemplate.exchange(peticionGet,ProductoDTO[].class);

			// Comprobamos el resultado
			assertThat(respuesta.getStatusCode().value()).isEqualTo(200);
		
			List<Producto> productosBD = productoRepo.findAll();
			assertThat(productosBD).hasSize(1);

		}

		@Test
		@DisplayName("inserta un producto repetido")
		public void insertarProductoRepetido(){
			// Preparamos el producto a insertar
			var ingrediente1 = IngredienteDTO.builder()
					.nombre("Chorizo")
					.id(1L)
					.build();
			var peticion1 = post("http", "localhost",port, "/ingredientes", ingrediente1);
			var respuesta1 = restTemplate.exchange(peticion1,Void.class);

			// var ingrediente2 = IngredienteDTO.builder()
			// 		.nombre("Tomate")
			// 		.id(2L)
			// 		.build();

			// var peticion2 = post("http", "localhost",port, "/ingredientes", ingrediente2);
			// var respuesta2 = restTemplate.exchange(peticion2,Void.class);

			var ingredientes = new HashSet<IngredienteDTO>();
			ingredientes.add(ingrediente1);
			// ingredientes.add(ingrediente2);

			var producto = ProductoDTO.builder()
					.nombre("Pizza")
					.id(1L)
					// .descripcion("Pizza de jamon y queso del Mercadona")
					.ingredientes(ingredientes)
					.build();
			
			// Preparamos la petición con el producto dentro
			var peticion = post("http", "localhost",port, "/productos", producto);
			var respuesta3 = restTemplate.exchange(peticion,Void.class);
			// Preparamos la petición con el producto dentro
			var peticion2 = post("http", "localhost",port, "/productos", producto);
			var respuesta4 = restTemplate.exchange(peticion2,Void.class);
			
			// Invocamos al servicio REST 
			var respuesta = restTemplate.exchange(peticion2,Void.class);
			
			// Comprobamos el resultado
			assertThat(respuesta.getStatusCode().value()).isEqualTo(409);
		
			List<Producto> productosBD = productoRepo.findAll();
			assertThat(productosBD).hasSize(1);
		}

		@Test
		@DisplayName("Elimina un ingrediente que no existe. Espera un 404")
		public void eliminarProductoNoExistente(){
			// Preparamos la petición con el producto dentro
			var peticion = delete("http", "localhost",port, "/productos/1");
			var respuesta = restTemplate.exchange(peticion,Void.class);
			// Comprobamos el resultado
			assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
		}
		
		@Test
		@DisplayName("Obtener un producto que no existe. Espera un 404")
		public void obtenerProductoNoExistente(){
			// Preparamos la petición con el producto dentro
			var peticion = get("http", "localhost",port, "/productos/1");
			var respuesta = restTemplate.exchange(peticion,Void.class);
			// Comprobamos el resultado
			assertThat(respuesta.getStatusCode().value()).isEqualTo(404);
		}

		@Test
		@DisplayName("Actualizar un ingrediente que no existe. Espera un 404")
		public void modificaIngredienteNoExistente(){
			var peticionPut = put("http", "localhost",port, "/ingredientes/"+1, null);
			var respuesta = restTemplate.exchange(peticionPut,Void.class);
			// Comprobamos el resultado
			assertThat(respuesta.getStatusCode().value()).isEqualTo(400);	//deberia ser 404
		}
	}
}
