package es.uma.informatica.practica3.servicios;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.uma.informatica.practica3.entidades.Ingrediente;
import es.uma.informatica.practica3.entidades.Producto;
import es.uma.informatica.practica3.repositorios.IngredienteRepository;
import es.uma.informatica.practica3.repositorios.ProductoRepository;
import es.uma.informatica.practica3.servicios.excepciones.EntidadExistenteException;
import es.uma.informatica.practica3.servicios.excepciones.EntidadNoEncontradaException;

@Service
@Transactional
public class ProductoServicio {
	
	private ProductoRepository productoRepo;
	private IngredienteRepository ingredienteRepo;
	
	public ProductoServicio(ProductoRepository productoRepo, 
			IngredienteRepository ingredienteRepo) {
		this.productoRepo = productoRepo;
		this.ingredienteRepo = ingredienteRepo;
	}
	
	public List<Ingrediente> obtenerIngredientes() {
		return ingredienteRepo.findAll();
	}
	
	public Ingrediente obtenerIngrediente(Long id) {
		var ingrediente = ingredienteRepo.findById(id);
		if (ingrediente.isPresent()) {
			return ingrediente.get();
		} else {
			throw new EntidadNoEncontradaException();
		}	
	}
	
	public Long aniadirIngrediente(Ingrediente ing) {
		if (!ingredienteRepo.existsByNombre(ing.getNombre())) {
			ing.setId(null);
			ingredienteRepo.save(ing);
			return ing.getId();
		} else {
			throw new EntidadExistenteException();
		}
	}
	
	public void eliminarIngrediente(Long id) {
		if (ingredienteRepo.existsById(id)) {
			ingredienteRepo.deleteById(id);
		} else {
			throw new EntidadNoEncontradaException();
		}
	}
	
	public void actualizarIngrediente(Ingrediente ingrediente) {
		if (ingredienteRepo.existsById(ingrediente.getId())) {
			ingredienteRepo.save(ingrediente);
		} else {
			throw new EntidadNoEncontradaException();
		}
	}
	
	public List<Producto> obtenerProductos() {
		return productoRepo.findAll();
	}
	
	public Producto obtenerProducto(Long id) {
		var producto = productoRepo.findById(id);
		if (producto.isPresent()) {
			return producto.get();
		} else {
			throw new EntidadNoEncontradaException();
		}	
	}
	
	private Optional<Ingrediente> refrescaIngrediente(Ingrediente ingrediente) {
		if (ingrediente.getId()!=null) {
			return ingredienteRepo.findById(ingrediente.getId());
		} else if (ingrediente.getNombre()!=null) {
			return ingredienteRepo.findFirstByNombre(ingrediente.getNombre());
		} else {
			return Optional.empty();
		}
	}
	
	public Long aniadirProducto(Producto producto) {
		if (productoRepo.existsByNombre(producto.getNombre())) {
			throw new EntidadExistenteException();
		}
		refrescarIngredientes(producto);
		productoRepo.save(producto);
		return producto.getId();
	}

	private void refrescarIngredientes(Producto producto) {
		var ingredientesEnContexto = producto.getIngredientes().stream()
			.map(ing -> refrescaIngrediente(ing)
							.orElseThrow(() -> new EntidadNoEncontradaException()))
			.collect(Collectors.toSet());
		producto.setIngredientes(ingredientesEnContexto);
	}
	
	public void eliminarProducto(Long id) {
		if (productoRepo.existsById(id)) {
			productoRepo.deleteById(id);
		} else {
			throw new EntidadNoEncontradaException();
		}
	}
	
	public void actualizarProducto(Producto producto) {
		if (productoRepo.existsById(producto.getId())) {
			refrescarIngredientes(producto);
			productoRepo.save(producto);
		} else {
			throw new EntidadNoEncontradaException();
		}
	}
	
	

}
