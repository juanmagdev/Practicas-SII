package es.uma.informatica.sii.practica2.servicios;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.uma.informatica.sii.practica2.entidades.Contacto;
import es.uma.informatica.sii.practica2.repositorios.ContactoRepo;
import es.uma.informatica.sii.practica2.servicios.excepciones.ContactoNoEncontrado;

@Service
@Transactional
public class LogicaContactos {
	
	private ContactoRepo repo;
	
	@Autowired
	public LogicaContactos(ContactoRepo repo) {
		this.repo=repo;
	}
	
	public List<Contacto> getTodosContactos() {
		return repo.findAll();
	}
	
	public Optional<Contacto> getContacto(Long id) {
		return repo.findById(id);
	}
	
	public List<Long> todosContactos(){
		return StreamSupport.stream(repo.findAll().spliterator(), false)
				.map(Contacto::getId)
				.toList();
	}

	public Long nuevoContacto(Contacto contacto) {
		contacto.setId(null);
		repo.save(contacto);
		return contacto.getId();
	}

	public void modificarContacto(Contacto contacto) {
		if (repo.existsById(contacto.getId())) {
			repo.findById(contacto.getId())
			.ifPresent(c->{
				c.setApellidos(contacto.getApellidos());
				c.setTelefono(contacto.getTelefono());
				c.setNombre(contacto.getNombre());
				c.setEmail(contacto.getEmail());
			});
		} else {
			throw new ContactoNoEncontrado();
		}
	}

	public void eliminarContacto(Long id) {
		if (repo.existsById(id)) {
			repo.deleteById(id);
		} else {
			throw new ContactoNoEncontrado();
		}
	}	
}
