package com.csehub.backend.service;

import com.csehub.backend.dto.CategoryDTO;
import com.csehub.backend.entity.Category;
import com.csehub.backend.entity.Resource;
import com.csehub.backend.entity.Session;
import com.csehub.backend.exception.ResourceNotFoundException;
import com.csehub.backend.repository.CategoryRepository;
import com.csehub.backend.repository.ResourceRepository;
import com.csehub.backend.repository.SessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ResourceRepository resourceRepository;
    private final SessionRepository sessionRepository;

    public CategoryService(CategoryRepository categoryRepository,
                            ResourceRepository resourceRepository,
                            SessionRepository sessionRepository) {
        this.categoryRepository = categoryRepository;
        this.resourceRepository = resourceRepository;
        this.sessionRepository = sessionRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAll() {
        return categoryRepository.findAllOrdered().stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public CategoryDTO getById(Long id) {
        return toDTO(findEntity(id));
    }

    public CategoryDTO create(CategoryDTO dto) {
        String name = requireName(dto.getName());
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("A category named '" + name + "' already exists");
        }
        Category category = new Category(name, dto.getIcon(), dto.getGroupName(), dto.getDescription());
        category.setDisplayOrder(nextDisplayOrder());
        return toDTO(categoryRepository.save(category));
    }

    public CategoryDTO update(Long id, CategoryDTO dto) {
        Category category = findEntity(id);
        String name = requireName(dto.getName());

        if (!name.equalsIgnoreCase(category.getName()) && categoryRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("A category named '" + name + "' already exists");
        }

        category.setName(name);
        category.setIcon(dto.getIcon());
        category.setGroupName(dto.getGroupName());
        category.setDescription(dto.getDescription());
        return toDTO(categoryRepository.save(category));
    }

    /**
     * Deletes a category. If it still has resources or sessions attached,
     * the delete is refused unless a target category id is supplied to
     * reassign them to first — this is what stops a category delete from
     * silently orphaning or destroying the user's saved content.
     */
    public void delete(Long id, Long reassignToId) {
        Category category = findEntity(id);

        long resourceCount = resourceRepository.countByCategoryId(id);
        long sessionCount = sessionRepository.countByCategoryId(id);

        if (resourceCount > 0 || sessionCount > 0) {
            if (reassignToId == null) {
                throw new IllegalArgumentException(String.format(
                        "\"%s\" still has %d resource(s) and %d session(s). Move them to another " +
                        "category first, or delete again with a category chosen to move them into.",
                        category.getName(), resourceCount, sessionCount));
            }
            if (reassignToId.equals(id)) {
                throw new IllegalArgumentException("Cannot move items into the category being deleted.");
            }
            Category target = categoryRepository.findById(reassignToId)
                    .orElseThrow(() -> new ResourceNotFoundException("Target category not found with id " + reassignToId));

            for (Resource r : resourceRepository.findByCategoryIdOrderByCreatedAtDesc(id)) {
                r.setCategory(target);
                resourceRepository.save(r);
            }
            for (Session s : sessionRepository.findByCategoryIdOrderByCreatedAtDesc(id)) {
                s.setCategory(target);
                sessionRepository.save(s);
            }
        }

        categoryRepository.delete(category);
    }

    /** Persists a new sort order for the given category ids (first id = position 0, etc.). */
    public List<CategoryDTO> reorder(List<Long> orderedIds) {
        int position = 0;
        for (Long id : orderedIds) {
            Category category = categoryRepository.findById(id).orElse(null);
            if (category == null) continue; // ignore unknown/stale ids rather than fail the whole reorder
            category.setDisplayOrder(position++);
            categoryRepository.save(category);
        }
        return getAll();
    }

    private int nextDisplayOrder() {
        List<Category> ordered = categoryRepository.findAllOrdered();
        if (ordered.isEmpty()) return 0;
        Category last = ordered.get(ordered.size() - 1);
        return (last.getDisplayOrder() == null ? ordered.size() - 1 : last.getDisplayOrder()) + 1;
    }

    private String requireName(String rawName) {
        String trimmed = rawName == null ? "" : rawName.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("Category name is required");
        }
        return trimmed;
    }

    private Category findEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
    }

    private CategoryDTO toDTO(Category c) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setIcon(c.getIcon());
        dto.setGroupName(c.getGroupName());
        dto.setDescription(c.getDescription());
        dto.setDisplayOrder(c.getDisplayOrder());
        dto.setResourceCount(resourceRepository.countByCategoryId(c.getId()));
        dto.setSessionCount(sessionRepository.countByCategoryId(c.getId()));
        return dto;
    }
}
