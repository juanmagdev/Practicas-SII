package es.uma.informatica.sii.jpa.proyectos;

import java.io.Closeable;
// import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

/**
 * Esta clase servirá para centralizar todas las operaciones relacionadas con la 
 * gestión de los datos relativos a los proyectos y sus tareas. 
 * Recuerde que las operaciones que modifiquen la base de datos deben ejecutarse dentro
 * de una transacción.
 * @author francis
 *
 */
public class AccesoDatos implements Closeable {
	
	private EntityManagerFactory emf;
	private EntityManager em;
	
	/**
	 * Constructor por defecto. Crea un contexto de persistencia.
	 */
	public AccesoDatos() {
		emf = Persistence.createEntityManagerFactory("p2-jpa");
		em = emf.createEntityManager();
	}
	
	/**
	 * Cierra el contexto de persistencia.
	 */
	@Override
	public void close() {
		em.close();
		emf.close();
	}	
}
