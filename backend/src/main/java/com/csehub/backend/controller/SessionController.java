package com.csehub.backend.controller;

import com.csehub.backend.dto.SessionDTO;
import com.csehub.backend.dto.SessionRequestDTO;
import com.csehub.backend.service.SessionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping
    public List<SessionDTO> getAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q
    ) {
        return sessionService.getAll(categoryId, q);
    }

    @GetMapping("/{id}")
    public SessionDTO getById(@PathVariable Long id) {
        return sessionService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SessionDTO create(@Valid @RequestBody SessionRequestDTO dto) {
        return sessionService.create(dto);
    }

    @PutMapping("/{id}")
    public SessionDTO update(@PathVariable Long id, @Valid @RequestBody SessionRequestDTO dto) {
        return sessionService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        sessionService.delete(id);
    }
}
