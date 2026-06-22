# WealthGuard

Repositorio monorepo con la aplicación frontend Angular (`WealthGuard`) y el backend Java (Hibernate/Spring) (`wealthward_backend_hibernate`). Proyecto para gestión financiera personal: usuarios, transacciones, presupuestos, recomendaciones y un chatbot integrado.

## Contenido

- `WealthGuard/` — Cliente frontend Angular (app SPA).
- `wealthward_backend_hibernate/` — API backend Java con Spring/Hibernate y migraciones SQL.

## Estado

Trabajo activo: frontend y backend incluidos. Revisar ramas y `target/` para artefactos generados.

## Requisitos

- Node.js >= 18 (para frontend)
- npm o pnpm
- Java 17+ (JDK) para backend
- Maven (o usar `mvnw` incluido)
- Base de datos compatible (PostgreSQL/MySQL) según configuración en `application*.yml`

## Frontend — WealthGuard (Angular)

Ruta: `WealthGuard/`

Instalación y ejecución en desarrollo:

```bash
cd WealthGuard
npm install
npm start
```

Ejecutar tests:

```bash
npm test
```

Build para producción:

```bash
npm run build
```

Notas:
- Archivos principales en `src/`.
- Rutas, componentes y servicios organizados según convención del proyecto.

## Backend — wealthward_backend_hibernate

Ruta: `wealthward_backend_hibernate/`

Instalación y ejecución en desarrollo (usar wrapper Maven incluido):

```bash
cd wealthward_backend_hibernate
./mvnw spring-boot:run    # en Windows: mvnw.cmd spring-boot:run
```

Ejecutar tests:

```bash
./mvnw test
```

Notas:
- Configuración en `src/main/resources/application.yml` y perfiles `application-dev.yml` / `application-prod.yml`.
- Migraciones SQL en `src/main/resources/db/migration` (Flyway). En el build generado también en `target/classes/db/migration`.

## Variables de entorno / Configuración

- Ajustar conexión a BD en `application-dev.yml` o mediante variables de entorno.
- Revisar propiedades de `application.yml` para puertos y credenciales.

## Desarrollo local recomendados

- Ejecutar backend y frontend en paralelo.
- Configurar CORS si el frontend y backend corren en orígenes distintos (configuración del backend).

## Contribuir

- Fork → branch feature/mi-cambio → PR con descripción y pruebas.
- Añadir tests unitarios o de integración según corresponda.
- Seguir convenciones de codificación del repo y pasar linters/tests antes de PR.

## Migraciones y datos

- Las migraciones están gestionadas por SQL en `src/main/resources/db/migration`.
- Para reset o cargas iniciales, revisar scripts `V*_*.sql` en la carpeta de migraciones.

## Despliegue

- Frontend: construir con `npm run build` y servir los archivos estáticos desde un servidor web o CDN.
- Backend: empaquetar con Maven (`./mvnw package`) y desplegar el JAR o en contenedor Docker (crear Dockerfile según necesidades).

## Estructura rápida del frontend

- `src/app/components/` — componentes UI y layout.
- `src/app/models/` — modelos TypeScript.
- `src/app/services/` — servicios para API y utilidades.

## Contacto y soporte

Para dudas o reportes de bugs, abrir un issue en el repositorio o contactar al equipo responsable.

## Licencia

Añadir la licencia del proyecto (por ejemplo, MIT) si aplica. Si no hay una, considerar añadir `LICENSE`.

---

Si quieres, puedo:

- Personalizar más el README (capturas, comandos exactos de despliegue, variables env). 
- Añadir `LICENSE` y plantillas de `CONTRIBUTING.md` y `CODE_OF_CONDUCT.md`.
# WealthWard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
