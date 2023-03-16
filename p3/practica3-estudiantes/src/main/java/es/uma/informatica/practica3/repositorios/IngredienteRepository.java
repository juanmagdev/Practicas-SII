package es.uma.informatica.practica3.repositorios;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import es.uma.informatica.practica3.entidades.Ingrediente;

public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
	Optional<Ingrediente> findFirstByNombre(String nombre);
	boolean existsByNombre(String nombre);
}
