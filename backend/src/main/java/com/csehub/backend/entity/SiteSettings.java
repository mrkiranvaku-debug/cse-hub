package com.csehub.backend.entity;

import jakarta.persistence.*;

/**
 * Singleton settings row (fixed id = 1) holding the user-editable home page
 * text and banner customization, so none of it is hardcoded in the frontend.
 */
@Entity
@Table(name = "site_settings")
public class SiteSettings {

    public static final Long SINGLETON_ID = 1L;

    @Id
    private Long id = SINGLETON_ID;

    @Column(length = 100)
    private String greeting = "Good afternoon, Kiran 👋";

    @Column(length = 255)
    private String subtitle = "Your personal Computer Science knowledge space.";

    @Column(name = "quote_text", length = 500)
    private String quoteText = "Discipline today, a dream career tomorrow.";

    @Column(name = "quote_author", length = 100)
    private String quoteAuthor = "CSE HUB";

    @Column(name = "supporting_text", length = 255)
    private String supportingText;

    @Column(name = "banner_title", length = 100)
    private String bannerTitle = "CSE HUB";

    @Column(name = "banner_tagline", length = 150)
    private String bannerTagline = "LEARN · BUILD · SOLVE · REPEAT";

    /** Null means "use the built-in default futuristic SVG hero". */
    @Column(name = "banner_image_url", length = 500)
    private String bannerImageUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGreeting() {
        return greeting;
    }

    public void setGreeting(String greeting) {
        this.greeting = greeting;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getQuoteText() {
        return quoteText;
    }

    public void setQuoteText(String quoteText) {
        this.quoteText = quoteText;
    }

    public String getQuoteAuthor() {
        return quoteAuthor;
    }

    public void setQuoteAuthor(String quoteAuthor) {
        this.quoteAuthor = quoteAuthor;
    }

    public String getSupportingText() {
        return supportingText;
    }

    public void setSupportingText(String supportingText) {
        this.supportingText = supportingText;
    }

    public String getBannerTitle() {
        return bannerTitle;
    }

    public void setBannerTitle(String bannerTitle) {
        this.bannerTitle = bannerTitle;
    }

    public String getBannerTagline() {
        return bannerTagline;
    }

    public void setBannerTagline(String bannerTagline) {
        this.bannerTagline = bannerTagline;
    }

    public String getBannerImageUrl() {
        return bannerImageUrl;
    }

    public void setBannerImageUrl(String bannerImageUrl) {
        this.bannerImageUrl = bannerImageUrl;
    }
}
