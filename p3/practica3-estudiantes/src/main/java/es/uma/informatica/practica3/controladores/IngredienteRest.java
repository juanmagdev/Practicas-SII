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

import es.uma.informatica.practica3.dtos.IngredienteDTO;
import es.uma.informatica.practica3.entidades.Ingrediente;
import es.uma.informatica.practica3.servicios.ProductoServicio;
import es.uma.informatica.practica3.servicios.excepciones.EntidadExistenteException;
import es.uma.informatica.practica3.servicios.excepciones.EntidadNoEncontradaException;

@RestController
@RequestMapping("/ingredientes")
public class IngredienteRest {

	private ProductoServicio servicio;
	
	public IngredienteRest(ProductoServicio servicio) {
		this.servicio = servicio;
	}
	
	@GetMapping
	public List<IngredienteDTO> obtenerTodosLosIngredientes(UriComponentsBuilder uriBuilder) {
		var ingredientes = servicio.obtenerIngredientes();
		return ingredientes.stream()
				.map(ing->IngredienteDTO.fromIngrediente(ing, 
									ingredienteUriBuilder(uriBuilder.build())))
		.toList();
	}
	
	public static Function<Long, URI> ingredienteUriBuilder(UriComponents uriComponents) {
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance().uriComponents(uriComponents);
		return id -> uriBuilder.path("/ingredientes")
				.path(String.format("/%d", id))
				.build()
				.toUri();
	}
	
	@PostMapping
	public ResponseEntity<?> aniadirIngrediente(@RequestBody IngredienteDTO ingrediente, UriComponentsBuilder uriBuilder) {
		Long id = servicio.aniadirIngrediente(ingrediente.ingrediente());
		return ResponseEntity.created(ingredienteUriBuilder(uriBuilder.build()).apply(id))
								.build();
	}
	
	@GetMapping("{id}")
	public IngredienteDTO obtenerIngrediente(@PathVariable Long id, UriComponentsBuilder uriBuilder) {
		var ingrediente = servicio.obtenerIngrediente(id);
		return IngredienteDTO.fromIngrediente(ingrediente, ingredienteUriBuilder(uriBuilder.build()));
	}
	
	@PutMapping("{id}")
	public void actualizarIngrediente(@PathVariable Long id, @RequestBody IngredienteDTO ingrediente) {
		Ingrediente ing = ingrediente.ingrediente();
		ing.setId(id);
		servicio.actualizarIngrediente(ing);
	}
	
	@DeleteMapping("{id}")
	public void eliminarIngrediente(@PathVariable Long id) {
		servicio.eliminarIngrediente(id);
	}
	
	@ExceptionHandler(EntidadNoEncontradaException.class)
	@ResponseStatus(code = HttpStatus.NOT_FOUND)
	public void noEncontrado() {}
	
	@ExceptionHandler(EntidadExistenteException.class)
	@ResponseStatus(code = HttpStatus.CONFLICT)
	public void existente() {}
	
}
