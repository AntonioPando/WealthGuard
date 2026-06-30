# WealthGuard

Aplicación para gestión financiera personal. Proyecto monorepo con Backend Java (Spring Boot + Maven) y Frontend Angular.

## Estructura del repositorio

- `Backend/` - Servicio backend Java (Spring Boot). Contiene `pom.xml`, `mvnw` y la aplicación.
- `Frontend/` - Aplicación cliente Angular.

## Requisitos

- Java 17+ (JDK instalado)
- Maven (se puede usar el wrapper `mvnw` incluido)
- Node.js 18+ y npm
- Angular CLI (opcional para desarrollo local)

## Configuración rápida

1. Clona el repositorio.
2. Configura las variables de entorno necesarias (si aplica) o revisa los archivos de configuración en `Backend/src/main/resources/`.

## Ejecutar Backend (desarrollo)

Desde la carpeta `Backend` puedes usar el wrapper de Maven incluido:

```bash
cd Backend
./mvnw spring-boot:run        # Unix / WSL / Git Bash
mvnw.cmd spring-boot:run     # Windows PowerShell / CMD
```

Alternativamente, compilar y ejecutar el JAR:

```bash
cd Backend
./mvnw clean package
java -jar target/*.jar
```

Archivos de configuración relevantes:

- `Backend/src/main/resources/application.yml`
- `Backend/src/main/resources/application-dev.yml`
- `Backend/src/main/resources/application-prod.yml`
- Migraciones DB: `Backend/src/main/resources/db/` (si se usa Flyway).

## Ejecutar Frontend (desarrollo)

Desde la carpeta `Frontend`:

```bash
cd Frontend
npm install
npm start       # o `ng serve` si está instalado globalmente
```

Para producción (build):

```bash
cd Frontend
npm run build
```

## Endpoints y conexión

El backend por defecto expone la API en `http://localhost:8080` (configurable en `application.yml`). Ajusta el origen en el frontend si es necesario (`app.config.ts` o configuración de ambiente).

## Tests

Backend (JUnit / Maven):

```bash
cd Backend
./mvnw test
```

Frontend (Jasmine/Karma, si está configurado):

```bash
cd Frontend
npm test
```

## Estructura de carpetas (resumen)

- `Backend/src/main/java/` - Código fuente Java (paquetes como `wealthguard.*`).
- `Backend/src/main/resources/` - Configuración y recursos.
- `Frontend/src/` - Código fuente Angular (components, services, models).

## Notas y recomendaciones

- Asegura que las credenciales y variables sensibles no se suban al repositorio (usa archivos `.env` o secretos de CI).