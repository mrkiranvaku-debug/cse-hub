package com.csehub.backend.service;

import com.csehub.backend.entity.Tag;
import com.csehub.backend.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    /** Resolves a list of tag names into managed Tag entities, creating new ones as needed. */
    public Set<Tag> resolveTags(List<String> names) {
        Set<Tag> tags = new HashSet<>();
        if (names == null) return tags;
        for (String raw : names) {
            if (raw == null || raw.isBlank()) continue;
            String name = raw.trim().toLowerCase();
            Tag tag = tagRepository.findByNameIgnoreCase(name)
                    .orElseGet(() -> tagRepository.save(new Tag(name)));
            tags.add(tag);
        }
        return tags;
    }
}
