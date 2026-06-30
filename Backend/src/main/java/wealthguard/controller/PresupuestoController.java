package wealthguard.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import wealthguard.dto.PresupuestoRequestDTO;
import wealthguard.dto.PresupuestoResponseDTO;
import wealthguard.service.IPresupuestoService;

@RestController
@RequestMapping("/presupuestos")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
        RequestMethod.GET, RequestMethod.POST,
        RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS })
public class PresupuestoController {

    @Autowired
    private IPresupuestoService presupuestoService;

    @GetMapping("/listar/{idUsuario}")
    public List<PresupuestoResponseDTO> obtenerPresupuestos(
            @PathVariable Integer idUsuario,
            @RequestParam String nickUsuario,
            @RequestParam String contrasena) throws Exception {
        return presupuestoService.obtenerPresupuestos(idUsuario, nickUsuario, contrasena);
    }

    @PostMapping("/crear")
    public PresupuestoResponseDTO crearPresupuesto(
            @org.springframework.web.bind.annotation.RequestBody PresupuestoRequestDTO presupuestoRequestDTO,
            @RequestParam String nickUsuario,
            @RequestParam String contrasena) throws Exception {
        return presupuestoService.crearPresupuesto(presupuestoRequestDTO, nickUsuario, contrasena);
    }

    @PutMapping("/editar/{idPresupuesto}")
    public ResponseEntity<Boolean> editarPresupuesto(
            @PathVariable int idPresupuesto,
            @RequestParam int idCategoria,
            @RequestParam double limite,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
            @RequestParam String nickUsuario,
            @RequestParam String contrasena) throws Exception {

        boolean editado = presupuestoService.editarPresupuesto(
                idPresupuesto, idCategoria, limite, fechaInicio, fechaFin, nickUsuario, contrasena);

        return editado ? ResponseEntity.ok(true) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/eliminar/{idPresupuesto}")
    public ResponseEntity<Boolean> eliminarPresupuesto(
            @PathVariable int idPresupuesto,
            @RequestParam String nickUsuario,
            @RequestParam String contrasena) throws Exception {

        boolean eliminado = presupuestoService.eliminarPresupuesto(idPresupuesto, nickUsuario, contrasena);
        return eliminado ? ResponseEntity.ok(true) : ResponseEntity.notFound().build();
    }
}