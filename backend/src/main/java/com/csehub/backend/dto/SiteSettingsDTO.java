package com.csehub.backend.dto;

public class SiteSettingsDTO {
    private String greeting;
    private String subtitle;
    private String quoteText;
    private String quoteAuthor;
    private String supportingText;
    private String bannerTitle;
    private String bannerTagline;
    private String bannerImageUrl;

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
