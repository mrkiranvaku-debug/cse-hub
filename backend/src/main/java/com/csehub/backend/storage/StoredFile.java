package com.csehub.backend.storage;

/** Metadata returned after a file is saved to disk by {@link FileStorageService}. */
public class StoredFile {

    private final String servedUrl;
    private final String originalFileName;
    private final long size;
    private final String contentType;

    public StoredFile(String servedUrl, String originalFileName, long size, String contentType) {
        this.servedUrl = servedUrl;
        this.originalFileName = originalFileName;
        this.size = size;
        this.contentType = contentType;
    }

    public String getServedUrl() {
        return servedUrl;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public long getSize() {
        return size;
    }

    public String getContentType() {
        return contentType;
    }
}
