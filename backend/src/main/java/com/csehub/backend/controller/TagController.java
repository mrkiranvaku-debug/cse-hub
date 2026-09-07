package com.csehub.backend.controller;

import com.csehub.backend.repository.TagRepository;
import com.csehub.backend.entity.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagRepository tagRepository;

    public TagController(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @GetMapping
    public List<String> getAll() {
        return tagRepository.findAll().stream().map(Tag::getName).sorted().toList();
    }
}
