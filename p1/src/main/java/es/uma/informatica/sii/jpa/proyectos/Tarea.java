package es.uma.informatica.sii.jpa.proyectos;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Embeddable; 
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.ManyToOne;


@Entity
@IdClass(Tarea.TareaId.class)
public class Tarea {
	@Embeddable
	public static class TareaId implements Serializable {
		private static final long serialVersionUID = -7636200172590268843L;
		private Long proyecto;
		private Long id;
		public Long getProyecto() {
			return proyecto;
		}
		public void setProyecto(Long proyecto) {
			this.proyecto = proyecto;
		}
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		@Override
		public int hashCode() {
			final int prime = 31;
			int result = 1;
			result = prime * result + ((id == null) ? 0 : id.hashCode());
			result = prime * result + ((proyecto == null) ? 0 : proyecto.hashCode());
			return result;
		}
		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			TareaId other = (TareaId) obj;
			if (id == null) {
				if (other.id != null)
					return false;
			} else if (!id.equals(other.id))
				return false;
			if (proyecto == null) {
				if (other.proyecto != null)
					return false;
			} else if (!proyecto.equals(other.proyecto))
				return false;
			return true;
		}
		
	}
	@Id @ManyToOne
	private Proyecto proyecto;
	@Id
	private Long id;
	
	
	private Date fechaInicio;
	
	private Date fechaFin;
	private Double esfuerzo;
	private String nombre;
	private String descripcion;
	
	public Proyecto getProyecto() {
		return proyecto;
	}
	public void setProyecto(Proyecto proyecto) {
		this.proyecto = proyecto;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Date getFechaInicio() {
		return fechaInicio;
	}
	public void setFechaInicio(Date fechaInicio) {
		this.fechaInicio = fechaInicio;
	}
	public Date getFechaFin() {
		return fechaFin;
	}
	public void setFechaFin(Date fechaFin) {
		this.fechaFin = fechaFin;
	}
	public Double getEsfuerzo() {
		return esfuerzo;
	}
	public void setEsfuerzo(Double esfuerzo) {
		this.esfuerzo = esfuerzo;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getDescripcion() {
		return descripcion;
	}
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((proyecto == null) ? 0 : proyecto.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Tarea other = (Tarea) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (proyecto == null) {
			if (other.proyecto != null)
				return false;
		} else if (!proyecto.equals(other.proyecto))
			return false;
		return true;
	}
}
