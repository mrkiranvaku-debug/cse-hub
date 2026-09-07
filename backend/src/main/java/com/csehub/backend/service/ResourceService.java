package com.csehub.backend.service;

import com.csehub.backend.dto.ResourceDTO;
import com.csehub.backend.dto.ResourceRequestDTO;
import com.csehub.backend.entity.Category;
import com.csehub.backend.entity.Resource;
import com.csehub.backend.entity.ResourceSourceType;
import com.csehub.backend.entity.ResourceStatus;
import com.csehub.backend.entity.ResourceType;
import com.csehub.backend.entity.Tag;
import com.csehub.backend.exception.ResourceNotFoundException;
import com.csehub.backend.repository.CategoryRepository;
import com.csehub.backend.repository.ResourceRepository;
import com.csehub.backend.storage.FileStorageService;
import com.csehub.backend.storage.StoredFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final CategoryRepository categoryRepository;
    private final TagService tagService;
    private final FileStorageService fileStorageService;

    public ResourceService(ResourceRepository resourceRepository,
                            CategoryRepository categoryRepository,
                            TagService tagService,
                            FileStorageService fileStorageService) {
        this.resourceRepository = resourceRepository;
        this.categoryRepository = categoryRepository;
        this.tagService = tagService;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public List<ResourceDTO> getAll(Long categoryId, ResourceType type, ResourceStatus status, String q) {
        List<Resource> resources;

        if (q != null && !q.isBlank()) {
            resources = resourceRepository.search(q.trim());
        } else if (categoryId != null) {
            resources = resourceRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId);
        } else if (type != null) {
            resources = resourceRepository.findByResourceTypeOrderByCreatedAtDesc(type);
        } else if (status != null) {
            resources = resourceRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            resources = resourceRepository.findAllByOrderByCreatedAtDesc();
        }

        // apply any remaining filters on top of the primary query (simple in-memory AND filter)
        return resources.stream()
                .filter(r -> categoryId == null || (r.getCategory() != null && r.getCategory().getId().equals(categoryId)))
                .filter(r -> type == null || r.getResourceType() == type)
                .filter(r -> status == null || r.getStatus() == status)
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResourceDTO getById(Long id) {
        return toDTO(findEntity(id));
    }

    public ResourceDTO create(ResourceRequestDTO dto) {
        Resource resource = new Resource();
        applyRequest(resource, dto);
        return toDTO(resourceRepository.save(resource));
    }

    public ResourceDTO update(Long id, ResourceRequestDTO dto) {
        Resource resource = findEntity(id);
        applyRequest(resource, dto);
        return toDTO(resourceRepository.save(resource));
    }

    /** Creates a new resource from an uploaded PDF / PPT(X) / image instead of a link. */
    public ResourceDTO createFromUpload(String title, String description, Long categoryId,
                                         ResourceType resourceType, ResourceStatus status,
                                         List<String> tags, MultipartFile file) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + categoryId));

        StoredFile stored = fileStorageService.store(file, "resources", allDocumentAndImageExtensions());

        Resource resource = new Resource();
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setCategory(category);
        resource.setResourceType(resourceType);
        resource.setStatus(status != null ? status : ResourceStatus.TO_LEARN);
        resource.setTags(tagService.resolveTags(tags));
        resource.setSourceType(ResourceSourceType.FILE);
        resource.setUrl(stored.getServedUrl());
        resource.setOriginalFileName(stored.getOriginalFileName());
        resource.setFileSize(stored.getSize());
        resource.setFileContentType(stored.getContentType());

        return toDTO(resourceRepository.save(resource));
    }

    /** Replaces the uploaded file backing an existing resource, deleting the old one. */
    public ResourceDTO replaceFile(Long id, MultipartFile file) {
        Resource resource = findEntity(id);
        String previousUrl = resource.getSourceType() == ResourceSourceType.FILE ? resource.getUrl() : null;

        StoredFile stored = fileStorageService.store(file, "resources", allDocumentAndImageExtensions());

        resource.setSourceType(ResourceSourceType.FILE);
        resource.setUrl(stored.getServedUrl());
        resource.setOriginalFileName(stored.getOriginalFileName());
        resource.setFileSize(stored.getSize());
        resource.setFileContentType(stored.getContentType());
        Resource saved = resourceRepository.save(resource);

        if (previousUrl != null) {
            fileStorageService.delete(previousUrl);
        }
        return toDTO(saved);
    }

    /** Uploads or replaces a resource's thumbnail/cover image. */
    public ResourceDTO uploadThumbnail(Long id, MultipartFile file) {
        Resource resource = findEntity(id);
        String previousThumbnail = resource.getThumbnailUrl();

        StoredFile stored = fileStorageService.store(file, "thumbnails", FileStorageService.IMAGE_EXTENSIONS);
        resource.setThumbnailUrl(stored.getServedUrl());
        Resource saved = resourceRepository.save(resource);

        deleteThumbnailIfUnused(previousThumbnail);
        return toDTO(saved);
    }

    /** Removes a resource's custom thumbnail, falling back to the default type icon. */
    public ResourceDTO removeThumbnail(Long id) {
        Resource resource = findEntity(id);
        String previousThumbnail = resource.getThumbnailUrl();
        resource.setThumbnailUrl(null);
        Resource saved = resourceRepository.save(resource);

        deleteThumbnailIfUnused(previousThumbnail);
        return toDTO(saved);
    }

    public void delete(Long id) {
        Resource resource = findEntity(id);

        if (resource.getSourceType() == ResourceSourceType.FILE) {
            fileStorageService.delete(resource.getUrl());
        }
        String thumbnail = resource.getThumbnailUrl();

        resourceRepository.delete(resource);

        // the resource row is gone now, so any remaining reference count reflects other resources only
        deleteThumbnailIfUnused(thumbnail);
    }

    /** Deletes an uploaded thumbnail file only if no resource still references it. */
    private void deleteThumbnailIfUnused(String thumbnailUrl) {
        if (thumbnailUrl == null || !thumbnailUrl.startsWith("/uploads/")) return;
        if (resourceRepository.countByThumbnailUrl(thumbnailUrl) == 0) {
            fileStorageService.delete(thumbnailUrl);
        }
    }

    private static Set<String> allDocumentAndImageExtensions() {
        return FileStorageService.allDocumentAndImageExtensions();
    }

    private void applyRequest(Resource resource, ResourceRequestDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + dto.getCategoryId()));

        resource.setTitle(dto.getTitle());
        resource.setDescription(dto.getDescription());
        resource.setUrl(dto.getUrl());
        resource.setThumbnailUrl(dto.getThumbnailUrl());
        resource.setCategory(category);
        resource.setResourceType(dto.getResourceType());
        resource.setStatus(dto.getStatus() != null ? dto.getStatus() : ResourceStatus.TO_LEARN);
        resource.setTags(tagService.resolveTags(dto.getTags()));
        // NOTE: sourceType/originalFileName/fileSize/fileContentType are intentionally left
        // untouched here — this JSON path is for link-based create/edit and for editing the
        // metadata of a file-backed resource without disturbing its uploaded file.
    }

    private Resource findEntity(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id " + id));
    }

    private ResourceDTO toDTO(Resource r) {
        ResourceDTO dto = new ResourceDTO();
        dto.setId(r.getId());
        dto.setTitle(r.getTitle());
        dto.setDescription(r.getDescription());
        dto.setUrl(r.getUrl());
        dto.setThumbnailUrl(r.getThumbnailUrl());
        if (r.getCategory() != null) {
            dto.setCategoryId(r.getCategory().getId());
            dto.setCategoryName(r.getCategory().getName());
            dto.setCategoryIcon(r.getCategory().getIcon());
        }
        dto.setResourceType(r.getResourceType());
        dto.setStatus(r.getStatus());
        dto.setTags(r.getTags().stream().map(Tag::getName).sorted().toList());
        dto.setSourceType(r.getSourceType());
        dto.setOriginalFileName(r.getOriginalFileName());
        dto.setFileSize(r.getFileSize());
        dto.setFileContentType(r.getFileContentType());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }
}
