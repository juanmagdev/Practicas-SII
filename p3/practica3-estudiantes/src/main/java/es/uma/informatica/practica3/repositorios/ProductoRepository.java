package es.uma.informatica.practica3.repositorios;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import es.uma.informatica.practica3.entidades.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
	Optional<Producto> findFirstByNombre(String nombre);
	boolean existsByNombre(String nombre);
}
