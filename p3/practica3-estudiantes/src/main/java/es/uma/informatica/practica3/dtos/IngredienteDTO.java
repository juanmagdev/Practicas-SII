package es.uma.informatica.practica3.dtos;

import java.net.URI;
import java.util.function.Function;

import com.fasterxml.jackson.annotation.JsonProperty;

import es.uma.informatica.practica3.entidades.Ingrediente;
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
public class IngredienteDTO {
	private Long id;
	private String nombre;
	@JsonProperty("_links")
	private Links links;
	
	public static IngredienteDTO fromIngrediente(Ingrediente ingrediente, Function<Long, URI> uriBuilder) {
		var dto = new IngredienteDTO();
		dto.setId(ingrediente.getId());
		dto.setNombre(ingrediente.getNombre());
		dto.setLinks(
				Links.builder()
					.self(uriBuilder.apply(ingrediente.getId()))
					.build());
		return dto;
	}
	
	public Ingrediente ingrediente() {
		var ing = new Ingrediente();
		ing.setId(id);
		ing.setNombre(nombre);
		return ing;
	}

}
