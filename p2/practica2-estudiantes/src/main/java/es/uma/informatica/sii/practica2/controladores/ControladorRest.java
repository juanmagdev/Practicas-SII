package es.uma.informatica.sii.practica2.controladores;

import java.net.URI;
import java.util.List;

import java.util.Optional;
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
import org.springframework.web.util.UriComponentsBuilder;

import es.uma.informatica.sii.practica2.entidades.Contacto;
import es.uma.informatica.sii.practica2.servicios.LogicaContactos;
import es.uma.informatica.sii.practica2.servicios.excepciones.ContactoNoEncontrado;

@RestController
@RequestMapping("/api/agenda/contactos")
public class ControladorRest {
	private LogicaContactos servicio;

	public ControladorRest(LogicaContactos servicioContactos) {
		servicio = servicioContactos;
	}

	@GetMapping
	public ResponseEntity<List<Contacto>> listaDeContactos() {
		return ResponseEntity.ok(servicio.getTodosContactos());
	}

	@PostMapping
	public ResponseEntity<?> aniadirContacto(@RequestBody Contacto contacto, UriComponentsBuilder builder) {
		Long id = servicio.nuevoContacto(contacto);
		URI uri = builder
				.path("/api")
				.path("/agenda")
				.path("/contactos")
				.path(String.format("/%d",id))
				.build()
				.toUri();
		return ResponseEntity.created(uri).build();
	}
	
	@GetMapping("{id}")
	public ResponseEntity<Contacto> obtenerLista(@PathVariable Long id) {
		Optional<Contacto> getContacto = servicio.getContacto(id);
		return ResponseEntity.of(getContacto);
	}


	@PutMapping("{id}")
	public ResponseEntity<?> modificarContacto(@PathVariable Long id, @RequestBody Contacto contacto){
		contacto.setId(id);
		servicio.modificarContacto(contacto);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("{id}")
	@ResponseStatus(code = HttpStatus.OK)
	public void eliminarLista(@PathVariable Long id) {
		servicio.eliminarContacto(id);
	}

	@ExceptionHandler(ContactoNoEncontrado.class)
	@ResponseStatus(code = HttpStatus.NOT_FOUND)
	public void noEncontrado() {}
}
