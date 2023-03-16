package es.uma.informatica.practica3.controladores;

import java.net.URI;
import java.util.List;
import java.util.function.Function;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import es.uma.informatica.practica3.dtos.ProductoDTO;
import es.uma.informatica.practica3.entidades.Producto;
import es.uma.informatica.practica3.servicios.ProductoServicio;
import es.uma.informatica.practica3.servicios.excepciones.EntidadExistenteException;
import es.uma.informatica.practica3.servicios.excepciones.EntidadNoEncontradaException;

@RestController
@RequestMapping("/productos")
public class ProductoRest {

	private ProductoServicio servicio;
	
	public ProductoRest(ProductoServicio servicio) {
		this.servicio = servicio;
	}
	
	@GetMapping
	public List<ProductoDTO> obtenerTodosLosProductos(UriComponentsBuilder uriBuilder) {
		var productos = servicio.obtenerProductos();
		Function<Producto, ProductoDTO> mapper = (p -> 
			ProductoDTO.fromProducto(p, 
					productoUriBuilder(uriBuilder.build()), 
					IngredienteRest.ingredienteUriBuilder(uriBuilder.build())));
		return productos.stream()
			.map(mapper)
			.toList();
	}
	
	public static Function<Long, URI> productoUriBuilder(UriComponents uriBuilder) {
		;
		return id -> UriComponentsBuilder.newInstance().uriComponents(uriBuilder).path("/productos")
				.path(String.format("/%d", id))
				.build()
				.toUri();
	}
	
	@PostMapping
	public ResponseEntity<?> aniadirProducto(@RequestBody ProductoDTO producto, UriComponentsBuilder uriBuilder) {
		Producto prod = producto.producto();
		Long id = servicio.aniadirProducto(prod);
		return ResponseEntity.created(
				productoUriBuilder(uriBuilder.build()).apply(id))
				.build();
	}
	
	@GetMapping("{id}")
	@ResponseStatus(code=HttpStatus.OK)
	public ProductoDTO obtenerProducto(@PathVariable Long id, UriComponentsBuilder uriBuilder) {
		Producto producto = servicio.obtenerProducto(id);
		return ProductoDTO.fromProducto(producto, 
				productoUriBuilder(uriBuilder.build()), 
				IngredienteRest.ingredienteUriBuilder(uriBuilder.build()));
	}
	
	@PutMapping("{id}")
	public void actualizarProducto(@PathVariable Long id, @RequestBody ProductoDTO producto) {
		Producto entidadProducto = producto.producto();
		entidadProducto.setId(id);
		servicio.actualizarProducto(entidadProducto);
	}
	
	@DeleteMapping("{id}")
	public void eliminarProducto(@PathVariable Long id) {
		servicio.eliminarProducto(id);
	}
	
	@ExceptionHandler(EntidadNoEncontradaException.class)
	@ResponseStatus(code = HttpStatus.NOT_FOUND)
	public void noEncontrado() {}
	
	@ExceptionHandler(EntidadExistenteException.class)
	@ResponseStatus(code = HttpStatus.CONFLICT)
	public void existente() {}
	
}
