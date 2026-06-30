package wealthguard.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import wealthguard.dto.TransaccionRequestDTO;
import wealthguard.dto.TransaccionResponseDTO;
import wealthguard.service.ITransaccionService;

@RestController
@RequestMapping("/transacciones")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.GET,
                RequestMethod.POST, RequestMethod.PUT,
                RequestMethod.DELETE, RequestMethod.OPTIONS })
@Tag(name = "Transacciones", description = "Gestión de transacciones financieras del usuario")
public class TransaccionController {

        @Autowired
        private ITransaccionService transaccionService;

        @Operation(summary = "Listar transacciones con filtros dinámicos", description = "Devuelve las transacciones del usuario aplicando filtros opcionales. Por defecto lista los últimos 7 días.")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Listado de transacciones obtenido correctamente", content = @Content(array = @ArraySchema(schema = @Schema(implementation = TransaccionResponseDTO.class))))
        })
        @GetMapping("/listar/{idUsuario}")
        public List<TransaccionResponseDTO> listarTransacciones(
                        @Parameter(description = "ID del usuario", required = true) @PathVariable Integer idUsuario,
                        @Parameter(description = "Fecha de inicio del filtro (ISO 8601)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
                        @Parameter(description = "Fecha de fin del filtro (ISO 8601)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
                        @Parameter(description = "ID de la categoría para filtrar") @RequestParam(required = false) Integer idCategoria,
                        @Parameter(description = "Tipo: true = ingreso, false = gasto") @RequestParam(required = false) Boolean tipo,
                        @Parameter(description = "Cantidad exacta para filtrar") @RequestParam(required = false) Double cantidad,
                        @Parameter(description = "Texto a buscar en la descripción") @RequestParam(required = false) String descripcion,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return transaccionService.listarTransacciones(idUsuario, fechaInicio, fechaFin, idCategoria, tipo,
                                cantidad,
                                descripcion, nickUsuario, contrasena);
        }

        @Operation(summary = "Listar todas las transacciones de un usuario sin filtros")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Listado completo obtenido correctamente", content = @Content(array = @ArraySchema(schema = @Schema(implementation = TransaccionResponseDTO.class))))
        })
        @GetMapping("/listar-todas/{idUsuario}")
        public List<TransaccionResponseDTO> listarTodasPorUsuario(
                        @Parameter(description = "ID del usuario", required = true) @PathVariable Integer idUsuario,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return transaccionService.listarTodasPorUsuario(idUsuario, nickUsuario, contrasena);
        }

        @Operation(summary = "Crear una nueva transacción")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Transacción creada correctamente", content = @Content(schema = @Schema(implementation = TransaccionResponseDTO.class))),
                        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos", content = @Content)
        })
        @PostMapping("/crear")
        public TransaccionResponseDTO crearTransaccion(@RequestBody TransaccionRequestDTO transaccionRequestDTO,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return transaccionService.crearTransaccion(transaccionRequestDTO, nickUsuario, contrasena);
        }

        @Operation(summary = "Editar una transacción existente")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Transacción actualizada correctamente", content = @Content(schema = @Schema(implementation = TransaccionResponseDTO.class))),
                        @ApiResponse(responseCode = "404", description = "Transacción no encontrada", content = @Content)
        })
        @PutMapping("/editar/{id}")
        public TransaccionResponseDTO editarTransaccion(
                        @Parameter(description = "ID de la transacción a editar", required = true) @PathVariable Integer id,
                        @RequestBody TransaccionRequestDTO transaccionRequestDTO,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return transaccionService.editarTransaccion(id, transaccionRequestDTO, nickUsuario, contrasena);
        }

        @Operation(summary = "Eliminar una transacción por ID")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Transacción eliminada correctamente", content = @Content(schema = @Schema(implementation = Boolean.class))),
                        @ApiResponse(responseCode = "404", description = "Transacción no encontrada", content = @Content)
        })
        @DeleteMapping("/eliminar/{id}")
        public ResponseEntity<Boolean> eliminarTransaccion(
                        @Parameter(description = "ID de la transacción a eliminar", required = true) @PathVariable Integer id,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                boolean eliminado = transaccionService.eliminarTransaccion(id, nickUsuario, contrasena);
                if (eliminado) {
                        return ResponseEntity.ok(true);
                } else {
                        return ResponseEntity.notFound().build();
                }
        }

        @Operation(summary = "Obtener la tendencia de gasto del usuario")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Tendencia calculada correctamente", content = @Content(schema = @Schema(implementation = Double.class)))
        })
        @GetMapping("/tendencia/{idUsuario}")
        public double obtenerTendencia(
                        @Parameter(description = "ID del usuario", required = true) @PathVariable Integer idUsuario,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return transaccionService.obtenerTendencia(idUsuario, nickUsuario, contrasena);
        }

        @Operation(summary = "Obtener la categoría principal de gasto del usuario", description = "Devuelve un array con el nombre de la categoría en la que más gasta y su porcentaje")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Categoría principal obtenida correctamente", content = @Content(array = @ArraySchema(schema = @Schema(implementation = String.class))))
        })
        @GetMapping("/categoria-principal/{idUsuario}")
        public String[] categoriaPrincipal(
                        @Parameter(description = "ID del usuario", required = true) @PathVariable Integer idUsuario,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return transaccionService.obtenerCategoriaPrincipal(idUsuario, nickUsuario, contrasena);
        }

        @Operation(summary = "Obtener el progreso de la meta de ahorro del usuario", description = "Devuelve un array con los valores [ahorrado, objetivo]")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Datos de meta obtenidos correctamente", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Double.class))))
        })
        @GetMapping("/meta/{idUsuario}")
        public double[] obtenerMeta(
                        @Parameter(description = "ID del usuario", required = true) @PathVariable Integer idUsuario,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return transaccionService.obtenerMeta(idUsuario, nickUsuario, contrasena);
        }
}