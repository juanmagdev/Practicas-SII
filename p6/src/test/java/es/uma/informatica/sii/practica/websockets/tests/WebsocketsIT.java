package es.uma.informatica.sii.practica.websockets.tests;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class WebsocketsIT {
	private static final int WAITING_TIME = 500;
	private WebDriver driver1;
	private Map<String, Object> vars1;
	JavascriptExecutor js1;
	
	private WebDriver driver2;
	private Map<String, Object> vars2;
	JavascriptExecutor js2;
	
	private static String baseURL = "http://localhost:8080/index.html";
	
	/*
	@BeforeAll
	public static void setupClass() {
		String server="localhost";
		try (InputStream is = WebsocketsIT.class.getClassLoader().getResourceAsStream("pom.properties")) {
			Properties pomProperties = new Properties();
			pomProperties.load(is);
			server=pomProperties.getProperty("server.host");
		} catch (IOException e) {
			e.printStackTrace();
		}
		baseURL="http://"+server+":8080/practica.websockets/";
	}*/
	
	@BeforeEach
	public void setUp() {
		ChromeOptions options = new ChromeOptions();
		options.addArguments("--remote-allow-origins=*");
		driver1 = new ChromeDriver(options);
		js1 = (JavascriptExecutor) driver1;
		vars1 = new HashMap<String, Object>();
		
		driver2 = new ChromeDriver(options);
		js2 = (JavascriptExecutor) driver2;
		vars2 = new HashMap<String, Object>();
	}
	@AfterEach
	public void tearDown() {
		driver1.quit();
		driver2.quit();
	}
	
	@Test
	public void entrada() throws InterruptedException {
		entraUsuario(driver1, "francis");
		entraUsuario(driver2, "manolo");
		
		var areaChat = new WebDriverWait(driver1, Duration.ofSeconds(2))
				.until(driver->driver.findElement(By.id("areaChat")));
		Thread.sleep(WAITING_TIME);
		assertThat(areaChat.getText()).isEqualTo(">>>>>> Entra manolo");
	}
	
	private void entraUsuario(WebDriver webDriver, String usuario) {
		webDriver.get(baseURL);
		webDriver.manage().window().setSize(new Dimension(1200, 800));
		var entradaNombre = new WebDriverWait(webDriver, Duration.ofSeconds(2))
				.until(ExpectedConditions.presenceOfElementLocated(By.id("nombre")));
		entradaNombre.sendKeys(usuario);
		webDriver.findElement(By.id("botonEntrada")).click();
	}
	
	@Test
	public void mensaje2() throws InterruptedException {
		entraUsuario(driver1, "francis"); 
		entraUsuario(driver2, "manolo");
		mandaMensaje(driver1, "hola");
		mandaMensaje(driver2, "adios");
		Thread.sleep(WAITING_TIME);
		assertThat(driver1.findElement(By.id("areaChat")).getText()).isEqualTo(">>>>>> Entra manolo\nfrancis: hola\nmanolo: adios");
	}
	
	private void mandaMensaje(WebDriver webDriver, String message) {
		var entradaTexto = new WebDriverWait(webDriver,Duration.ofSeconds(2))
				.until(ExpectedConditions.presenceOfElementLocated(By.id("entradaTexto")));
		entradaTexto.sendKeys(message);
		entradaTexto.sendKeys(Keys.ENTER);
	}
	@Test
	public void mensaje() throws InterruptedException {
		entraUsuario(driver1, "francis"); 
		entraUsuario(driver2, "manolo");
		mandaMensaje(driver1, "hola");
		Thread.sleep(WAITING_TIME);
		assertThat(driver2.findElement(By.id("areaChat")).getText()).isEqualTo("francis: hola");
	}
	@Test
	public void salida() throws InterruptedException {
		entraUsuario(driver1, "francis"); 
		entraUsuario(driver2, "manolo");
		driver2.findElement(By.id("botonSalir")).click();
		Thread.sleep(WAITING_TIME);
		assertThat(driver1.findElement(By.id("areaChat")).getText()).isEqualTo(">>>>>> Entra manolo\n<<<<<< Sale manolo");
	}

	@Test
	public void salida2() throws InterruptedException {
		entraUsuario(driver1, "francis");
		entraUsuario(driver2, "manolo"); 
		var botonSalir = new WebDriverWait(driver1, Duration.ofSeconds(2))
				.until(ExpectedConditions.presenceOfElementLocated(By.id("botonSalir")));
		botonSalir.click();
		Thread.sleep(WAITING_TIME);
		assertThat(driver2.findElement(By.id("areaChat")).getText()).isEqualTo("<<<<<< Sale francis");
	}
	@Test
	public void salida3() throws InterruptedException {
		entraUsuario(driver1, "francis"); 
		entraUsuario(driver2, "manolo");
		driver2.quit();
		Thread.sleep(WAITING_TIME);
		assertThat(driver1.findElement(By.id("areaChat")).getText()).isEqualTo(">>>>>> Entra manolo\n<<<<<< Sale manolo");

	}
}
