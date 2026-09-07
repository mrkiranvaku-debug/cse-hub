package com.csehub.backend.service;

import com.csehub.backend.dto.SessionDTO;
import com.csehub.backend.dto.SessionRequestDTO;
import com.csehub.backend.entity.Category;
import com.csehub.backend.entity.Session;
import com.csehub.backend.entity.Tag;
import com.csehub.backend.exception.ResourceNotFoundException;
import com.csehub.backend.repository.CategoryRepository;
import com.csehub.backend.repository.SessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final CategoryRepository categoryRepository;
    private final TagService tagService;

    public SessionService(SessionRepository sessionRepository, CategoryRepository categoryRepository, TagService tagService) {
        this.sessionRepository = sessionRepository;
        this.categoryRepository = categoryRepository;
        this.tagService = tagService;
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getAll(Long categoryId, String q) {
        List<Session> sessions;
        if (q != null && !q.isBlank()) {
            sessions = sessionRepository.search(q.trim());
        } else if (categoryId != null) {
            sessions = sessionRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId);
        } else {
            sessions = sessionRepository.findAllByOrderByCreatedAtDesc();
        }
        return sessions.stream()
                .filter(s -> categoryId == null || (s.getCategory() != null && s.getCategory().getId().equals(categoryId)))
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public SessionDTO getById(Long id) {
        return toDTO(findEntity(id));
    }

    public SessionDTO create(SessionRequestDTO dto) {
        Session session = new Session();
        applyRequest(session, dto);
        return toDTO(sessionRepository.save(session));
    }

    public SessionDTO update(Long id, SessionRequestDTO dto) {
        Session session = findEntity(id);
        applyRequest(session, dto);
        return toDTO(sessionRepository.save(session));
    }

    public void delete(Long id) {
        Session session = findEntity(id);
        sessionRepository.delete(session);
    }

    private void applyRequest(Session session, SessionRequestDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + dto.getCategoryId()));

        session.setTitle(dto.getTitle());
        session.setCategory(category);
        session.setContent(dto.getContent());
        session.setTags(tagService.resolveTags(dto.getTags()));
    }

    private Session findEntity(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id " + id));
    }

    private SessionDTO toDTO(Session s) {
        SessionDTO dto = new SessionDTO();
        dto.setId(s.getId());
        dto.setTitle(s.getTitle());
        if (s.getCategory() != null) {
            dto.setCategoryId(s.getCategory().getId());
            dto.setCategoryName(s.getCategory().getName());
            dto.setCategoryIcon(s.getCategory().getIcon());
        }
        dto.setContent(s.getContent());
        dto.setTags(s.getTags().stream().map(Tag::getName).sorted().toList());
        dto.setCreatedAt(s.getCreatedAt());
        dto.setUpdatedAt(s.getUpdatedAt());
        return dto;
    }
}
