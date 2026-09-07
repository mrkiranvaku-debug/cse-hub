package com.csehub.backend.controller;

import com.csehub.backend.dto.CategoryDTO;
import com.csehub.backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDTO> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public CategoryDTO getById(@PathVariable Long id) {
        return categoryService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDTO create(@Valid @RequestBody CategoryDTO dto) {
        return categoryService.create(dto);
    }

    @PutMapping("/{id}")
    public CategoryDTO update(@PathVariable Long id, @Valid @RequestBody CategoryDTO dto) {
        return categoryService.update(id, dto);
    }

    /**
     * Deletes a category. If it still contains resources or sessions, pass
     * ?reassignToId={anotherCategoryId} to move them there first — otherwise
     * the delete is refused (400) with a message explaining why.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @RequestParam(required = false) Long reassignToId) {
        categoryService.delete(id, reassignToId);
    }

    /** Persists a new category order. Body is a JSON array of category ids in the desired order. */
    @PutMapping("/reorder")
    public List<CategoryDTO> reorder(@RequestBody List<Long> orderedIds) {
        return categoryService.reorder(orderedIds);
    }
}
