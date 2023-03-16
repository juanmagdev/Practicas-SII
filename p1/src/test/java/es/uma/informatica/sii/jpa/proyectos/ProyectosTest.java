package es.uma.informatica.sii.jpa.proyectos;

import java.text.SimpleDateFormat;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class ProyectosTest {
	
	private AccesoDatos ad;
	private SimpleDateFormat dateformat = new SimpleDateFormat("dd/MM/yyyy");
	
	@Before
	public void setup() {
		ad = new AccesoDatos();
	}
	
	@After
	public void teardown() {
		ad.close();
	}
	
	@Test
	public void testNada() {
		// Nada que hacer, está simplemente para abrir y cerrar el contexto de persistencia
	}
}
