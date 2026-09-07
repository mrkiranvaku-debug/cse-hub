package com.csehub.backend.controller;

import com.csehub.backend.dto.ResourceDTO;
import com.csehub.backend.dto.ResourceRequestDTO;
import com.csehub.backend.entity.ResourceStatus;
import com.csehub.backend.entity.ResourceType;
import com.csehub.backend.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public List<ResourceDTO> getAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) String q
    ) {
        return resourceService.getAll(categoryId, type, status, q);
    }

    @GetMapping("/{id}")
    public ResourceDTO getById(@PathVariable Long id) {
        return resourceService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceDTO create(@Valid @RequestBody ResourceRequestDTO dto) {
        return resourceService.create(dto);
    }

    @PutMapping("/{id}")
    public ResourceDTO update(@PathVariable Long id, @Valid @RequestBody ResourceRequestDTO dto) {
        return resourceService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        resourceService.delete(id);
    }

    /** Creates a new resource from an uploaded PDF / PPT(X) / image instead of a link. */
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceDTO uploadNew(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam Long categoryId,
            @RequestParam ResourceType resourceType,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) String tags,
            @RequestParam("file") MultipartFile file
    ) {
        return resourceService.createFromUpload(title, description, categoryId, resourceType, status,
                parseTags(tags), file);
    }

    /** Replaces the uploaded file backing an existing resource. */
    @PutMapping(value = "/{id}/file", consumes = "multipart/form-data")
    public ResourceDTO replaceFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return resourceService.replaceFile(id, file);
    }

    /** Uploads or replaces a resource's thumbnail/cover image. */
    @PostMapping(value = "/{id}/thumbnail", consumes = "multipart/form-data")
    public ResourceDTO uploadThumbnail(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return resourceService.uploadThumbnail(id, file);
    }

    /** Removes a resource's custom thumbnail. */
    @DeleteMapping("/{id}/thumbnail")
    public ResourceDTO removeThumbnail(@PathVariable Long id) {
        return resourceService.removeThumbnail(id);
    }

    private List<String> parseTags(String tagsCsv) {
        if (tagsCsv == null || tagsCsv.isBlank()) return List.of();
        return Arrays.stream(tagsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}
