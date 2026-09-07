package com.csehub.backend.service;

import com.csehub.backend.dto.SiteSettingsDTO;
import com.csehub.backend.entity.SiteSettings;
import com.csehub.backend.repository.SiteSettingsRepository;
import com.csehub.backend.storage.FileStorageService;
import com.csehub.backend.storage.StoredFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SiteSettingsService {

    private final SiteSettingsRepository siteSettingsRepository;
    private final FileStorageService fileStorageService;

    public SiteSettingsService(SiteSettingsRepository siteSettingsRepository, FileStorageService fileStorageService) {
        this.siteSettingsRepository = siteSettingsRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public SiteSettingsDTO getSettings() {
        return toDTO(loadOrCreate());
    }

    @Transactional
    public SiteSettingsDTO update(SiteSettingsDTO dto) {
        SiteSettings settings = loadOrCreate();
        if (dto.getGreeting() != null) settings.setGreeting(blankToDefault(dto.getGreeting(), settings.getGreeting()));
        if (dto.getSubtitle() != null) settings.setSubtitle(dto.getSubtitle());
        if (dto.getQuoteText() != null) settings.setQuoteText(dto.getQuoteText());
        if (dto.getQuoteAuthor() != null) settings.setQuoteAuthor(dto.getQuoteAuthor());
        if (dto.getSupportingText() != null) settings.setSupportingText(dto.getSupportingText());
        if (dto.getBannerTitle() != null) settings.setBannerTitle(blankToDefault(dto.getBannerTitle(), settings.getBannerTitle()));
        if (dto.getBannerTagline() != null) settings.setBannerTagline(dto.getBannerTagline());
        return toDTO(siteSettingsRepository.save(settings));
    }

    @Transactional
    public SiteSettingsDTO uploadBanner(MultipartFile file) {
        SiteSettings settings = loadOrCreate();
        String previous = settings.getBannerImageUrl();

        StoredFile stored = fileStorageService.store(file, "banner", FileStorageService.IMAGE_EXTENSIONS);
        settings.setBannerImageUrl(stored.getServedUrl());
        SiteSettings saved = siteSettingsRepository.save(settings);

        if (previous != null) {
            fileStorageService.delete(previous);
        }
        return toDTO(saved);
    }

    @Transactional
    public SiteSettingsDTO removeBanner() {
        SiteSettings settings = loadOrCreate();
        String previous = settings.getBannerImageUrl();
        settings.setBannerImageUrl(null);
        SiteSettings saved = siteSettingsRepository.save(settings);

        if (previous != null) {
            fileStorageService.delete(previous);
        }
        return toDTO(saved);
    }

    private SiteSettings loadOrCreate() {
        return siteSettingsRepository.findById(SiteSettings.SINGLETON_ID)
                .orElseGet(() -> siteSettingsRepository.save(new SiteSettings()));
    }

    private String blankToDefault(String value, String fallback) {
        return value.isBlank() ? fallback : value;
    }

    private SiteSettingsDTO toDTO(SiteSettings s) {
        SiteSettingsDTO dto = new SiteSettingsDTO();
        dto.setGreeting(s.getGreeting());
        dto.setSubtitle(s.getSubtitle());
        dto.setQuoteText(s.getQuoteText());
        dto.setQuoteAuthor(s.getQuoteAuthor());
        dto.setSupportingText(s.getSupportingText());
        dto.setBannerTitle(s.getBannerTitle());
        dto.setBannerTagline(s.getBannerTagline());
        dto.setBannerImageUrl(s.getBannerImageUrl());
        return dto;
    }
}
