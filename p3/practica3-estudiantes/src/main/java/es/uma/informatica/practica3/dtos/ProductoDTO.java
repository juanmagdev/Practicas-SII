package es.uma.informatica.practica3.dtos;

import java.net.URI;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonProperty;

import es.uma.informatica.practica3.entidades.Producto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDTO {
	
	private Long id;
	private String nombre;
	private String descripcion;
	private Set<IngredienteDTO> ingredientes;
	@JsonProperty("_links")
	private Links links;
	
	public static ProductoDTO fromProducto(Producto producto, 
			Function<Long, URI> productoUriBuilder, 
			Function<Long, URI> ingredienteUriBuilder) {
		var dto = new ProductoDTO();
		dto.setNombre(producto.getNombre());
		dto.setDescripcion(producto.getDescripcion());
		dto.setId(producto.getId());
		dto.setLinks(Links.builder()
				.self(productoUriBuilder.apply(producto.getId()))
				.build());
		
		dto.setIngredientes(
				producto.getIngredientes().stream()
					.map(i->IngredienteDTO.fromIngrediente(i, ingredienteUriBuilder))
					.collect(Collectors.toSet()));
		return dto;
	}
	
	public Producto producto() {
		var prod = new Producto();
		prod.setNombre(nombre);
		prod.setId(id);
		prod.setDescripcion(descripcion);
		prod.setIngredientes(
				Optional.ofNullable(ingredientes)
				.orElse((Set<IngredienteDTO>)Collections.EMPTY_SET)
				.stream()
					.map(IngredienteDTO::ingrediente)
					.collect(Collectors.toSet())
					);
		return prod;
	}

}
