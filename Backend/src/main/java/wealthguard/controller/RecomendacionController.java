package wealthguard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import wealthguard.dto.RecomendacionResponseDTO;
import wealthguard.service.IRecomendacionService;

@RestController
@RequestMapping("/recomendaciones")
@CrossOrigin(origins = "*")
public class RecomendacionController {

    @Autowired
    private IRecomendacionService recomendacionService;

    @PostMapping("/generar")
    public ResponseEntity<List<RecomendacionResponseDTO>> generar(
            @RequestParam int idUsuario,
            @RequestParam int score,
            @RequestParam String nickUsuario,
            @RequestParam String contrasena) throws Exception {
        return ResponseEntity
                .ok(recomendacionService.generarRecomendaciones(idUsuario, score, nickUsuario, contrasena));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<RecomendacionResponseDTO>> listar(
            @PathVariable int idUsuario,
            @RequestParam String nickUsuario,
            @RequestParam String contrasena) throws Exception {
        return ResponseEntity.ok(recomendacionService.obtenerRecomendaciones(idUsuario, nickUsuario, contrasena));
    }

    @DeleteMapping("/{idRecomendacion}")
    public ResponseEntity<Boolean> eliminar(
            @PathVariable int idRecomendacion,
            @RequestParam String nickUsuario,
            @RequestParam String contrasena) throws Exception {
        return ResponseEntity
                .ok(recomendacionService.eliminarRecomendacion(idRecomendacion, nickUsuario, contrasena));
    }
}