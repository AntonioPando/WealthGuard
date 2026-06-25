package wealthguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(
		info = @Info(
				title = "API de wealthguard",
				version = "1.0.0",
				description = "Documentación de la API de wealthguard"
		)
)
@SpringBootApplication
public class WealthguardApplication {

	public static void main(String[] args) {
		SpringApplication.run(WealthguardApplication.class, args);
	}

}

