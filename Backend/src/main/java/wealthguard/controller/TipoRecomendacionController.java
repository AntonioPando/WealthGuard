package wealthguard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import wealthguard.dto.TipoRecomendacionRequestDTO;
import wealthguard.dto.TipoRecomendacionResponseDTO;
import wealthguard.service.ITipoRecomendacionService;

@RestController
@RequestMapping("/tipo-recomendacion")
public class TipoRecomendacionController {

        @Autowired
        private ITipoRecomendacionService service;

        @PostMapping
        public TipoRecomendacionResponseDTO crear(@RequestBody TipoRecomendacionRequestDTO dto,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return service.crearTipoRecomendacion(dto, nickUsuario, contrasena);
        }

        @GetMapping
        public List<TipoRecomendacionResponseDTO> listarTodos(
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return service.listarTodos(nickUsuario, contrasena);
        }

        @GetMapping("/{id}")
        public TipoRecomendacionResponseDTO obtenerTipoRecomendacionPorId(
                        @PathVariable Integer id,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return service.obtenerTipoRecomendacionPorId(id, nickUsuario, contrasena);
        }

        @PutMapping("/{id}")
        public TipoRecomendacionResponseDTO actualizarTipoRecomendacion(
                        @PathVariable Integer id,
                        @RequestBody TipoRecomendacionRequestDTO dto,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return service.actualizarTipoRecomendacion(id, dto, nickUsuario, contrasena);
        }

        @DeleteMapping("/{id}")
        public void eliminarTipoRecomendacion(
                        @PathVariable Integer id,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                service.eliminarTipoRecomendacion(id, nickUsuario, contrasena);
        }
}