package es.uma.informatica.sii.practica2.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.uma.informatica.sii.practica2.entidades.Contacto;

@Repository
public interface ContactoRepo extends JpaRepository<Contacto, Long> {

}
