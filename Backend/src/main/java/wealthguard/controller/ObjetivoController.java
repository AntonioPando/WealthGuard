package wealthguard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import wealthguard.dto.ObjetivoRequestDTO;
import wealthguard.dto.ObjetivoResponseDTO;
import wealthguard.service.IObjetivoService;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE,
                RequestMethod.OPTIONS }, allowedHeaders = "*")
@RequestMapping("/objetivos")
public class ObjetivoController {

        @Autowired
        private IObjetivoService objetivoService;

        @PostMapping("/crear")
        public ResponseEntity<ObjetivoResponseDTO> crearObjetivo(
                        @RequestBody ObjetivoRequestDTO objetivoRequestDTO,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return ResponseEntity
                                .ok(objetivoService.crearObjetivo(objetivoRequestDTO, nickUsuario, contrasena));
        }

        @PutMapping("/editar/{id}")
        public ResponseEntity<ObjetivoResponseDTO> editarObjetivo(@PathVariable int id,
                        @RequestBody ObjetivoRequestDTO objetivoRequestDTO,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return ResponseEntity.ok(
                                objetivoService.editarObjetivo(id, objetivoRequestDTO, nickUsuario, contrasena));
        }

        @DeleteMapping("/eliminar/{id}")
        public ResponseEntity<Boolean> eliminarObjetivo(@PathVariable Integer id,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return ResponseEntity.ok(objetivoService.eliminarObjetivo(id, nickUsuario, contrasena));
        }

        @GetMapping("/activa/{idUsuario}")
        public ResponseEntity<ObjetivoResponseDTO> obtenerMetaActiva(@PathVariable Integer idUsuario,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return ResponseEntity.ok(objetivoService.obtenerObjetivo(idUsuario, nickUsuario, contrasena));
        }

        @GetMapping("/ultimo/{idUsuario}")
        public ResponseEntity<ObjetivoResponseDTO> obtenerMetaPasada(@PathVariable Integer idUsuario,
                        @RequestParam String nickUsuario,
                        @RequestParam String contrasena) throws Exception {
                return ResponseEntity.ok(objetivoService.obtenerUltimoObjetivo(idUsuario, nickUsuario, contrasena));
        }
}