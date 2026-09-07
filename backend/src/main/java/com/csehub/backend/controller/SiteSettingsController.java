package com.csehub.backend.controller;

import com.csehub.backend.dto.SiteSettingsDTO;
import com.csehub.backend.service.SiteSettingsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/settings")
public class SiteSettingsController {

    private final SiteSettingsService siteSettingsService;

    public SiteSettingsController(SiteSettingsService siteSettingsService) {
        this.siteSettingsService = siteSettingsService;
    }

    @GetMapping
    public SiteSettingsDTO get() {
        return siteSettingsService.getSettings();
    }

    @PutMapping
    public SiteSettingsDTO update(@RequestBody SiteSettingsDTO dto) {
        return siteSettingsService.update(dto);
    }

    @PostMapping(value = "/banner", consumes = "multipart/form-data")
    public SiteSettingsDTO uploadBanner(@RequestParam("file") MultipartFile file) {
        return siteSettingsService.uploadBanner(file);
    }

    @DeleteMapping("/banner")
    public SiteSettingsDTO removeBanner() {
        return siteSettingsService.removeBanner();
    }
}
