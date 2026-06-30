package wealthguard.controller;

import java.util.List;

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

import jakarta.validation.Valid;
import wealthguard.dto.CategoriaRequestDTO;
import wealthguard.dto.CategoriaResponseDTO;
import wealthguard.service.ICategoriaService;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE,
        RequestMethod.OPTIONS }, allowedHeaders = "*")
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private ICategoriaService categoriaService;

    @PostMapping("/crear")
    public CategoriaResponseDTO crearCategoria(
            @Valid @RequestBody CategoriaRequestDTO nombreCategoria,
            @RequestParam String nickUsuario,
            @RequestParam String contrasena) throws Exception {
        return categoriaService.crearCategoria(nombreCategoria, nickUsuario, contrasena);
    }

    @PutMapping("/editar/{id}")
    public CategoriaResponseDTO editarCategoria(
            @PathVariable Integer id,
            @Valid @RequestBody CategoriaRequestDTO nombreCategoria,
            @RequestParam String nickUsuario,
            @RequestParam String contrasena) throws Exception {
        return categoriaService.editarCategoria(id, nombreCategoria, nickUsuario, contrasena);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Boolean> eliminarCategoria(
            @PathVariable Integer id,
            @RequestParam String nickUsuario,
            @RequestParam String contrasena) throws Exception {
        boolean eliminado = categoriaService.eliminarCategoria(id, nickUsuario, contrasena);
        return eliminado ? ResponseEntity.ok(true) : ResponseEntity.notFound().build();
    }

    @GetMapping("/listar")
    public List<CategoriaResponseDTO> obtenerCategorias(
            @RequestParam String nickUsuario,
            @RequestParam String contrasena) throws Exception {
        return categoriaService.obtenerCategorias(nickUsuario, contrasena);
    }
}