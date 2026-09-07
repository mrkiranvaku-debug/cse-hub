package com.csehub.backend.storage;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

/**
 * Saves uploaded files (resource files, thumbnails, banner images) to a local
 * "uploads" directory on disk and serves them back over HTTP via the
 * "/uploads/**" static resource mapping (see WebUploadConfig). Filenames are
 * always regenerated with a random UUID — the caller-supplied original name
 * is kept only as display metadata and is never used to build a filesystem
 * path, which prevents path traversal.
 */
@Service
public class FileStorageService {

    public static final Set<String> DOCUMENT_EXTENSIONS = Set.of("pdf", "ppt", "pptx");
    public static final Set<String> IMAGE_EXTENSIONS = Set.of("png", "jpg", "jpeg", "webp");

    @Value("${app.upload.dir:uploads}")
    private String uploadDirProperty;

    private Path uploadRoot;

    @PostConstruct
    public void init() {
        try {
            this.uploadRoot = Paths.get(uploadDirProperty).toAbsolutePath().normalize();
            Files.createDirectories(uploadRoot.resolve("resources"));
            Files.createDirectories(uploadRoot.resolve("thumbnails"));
            Files.createDirectories(uploadRoot.resolve("banner"));
        } catch (IOException e) {
            throw new IllegalStateException("Could not initialize upload directory at " + uploadDirProperty, e);
        }
    }

    /**
     * Validates and stores an uploaded file under the given sub-directory
     * ("resources", "thumbnails", or "banner"), returning the metadata needed
     * to reference it later.
     */
    public StoredFile store(MultipartFile file, String subDir, Set<String> allowedExtensions) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file was uploaded.");
        }

        String originalName = StringUtils.getFilename(file.getOriginalFilename());
        if (!StringUtils.hasText(originalName)) {
            throw new IllegalArgumentException("The uploaded file has no name.");
        }
        // Keep only the last path segment as display metadata — never trust it as a path.
        originalName = Paths.get(originalName).getFileName().toString();
        if (originalName.length() > 200) {
            originalName = originalName.substring(originalName.length() - 200);
        }

        String extension = extractExtension(originalName);
        if (extension.isEmpty() || !allowedExtensions.contains(extension)) {
            throw new IllegalArgumentException(
                    "Unsupported file type. Allowed: " + String.join(", ", allowedExtensions));
        }

        String storedName = UUID.randomUUID() + "." + extension;
        Path target = uploadRoot.resolve(subDir).resolve(storedName).normalize();

        // Defense in depth: make sure we never write outside the intended sub-directory.
        if (!target.startsWith(uploadRoot.resolve(subDir).normalize())) {
            throw new IllegalArgumentException("Invalid file name.");
        }

        try {
            Files.copy(file.getInputStream(), target);
        } catch (IOException e) {
            throw new IllegalStateException("Could not save the uploaded file.", e);
        }

        String servedUrl = "/uploads/" + subDir + "/" + storedName;
        return new StoredFile(servedUrl, originalName, file.getSize(), file.getContentType());
    }

    /**
     * Deletes a previously stored file given its served URL. Silently does
     * nothing if the URL doesn't point at our managed uploads (e.g. it's an
     * external link) or the file no longer exists — deletion failures never
     * block the caller's main operation.
     */
    public void delete(String servedUrl) {
        if (!StringUtils.hasText(servedUrl) || !servedUrl.startsWith("/uploads/")) {
            return;
        }
        try {
            String relative = servedUrl.substring("/uploads/".length());
            Path target = uploadRoot.resolve(relative).normalize();
            if (target.startsWith(uploadRoot)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException e) {
            // Best-effort cleanup only — never let a stray file block a delete/update.
            System.err.println("Could not delete stored file " + servedUrl + ": " + e.getMessage());
        }
    }

    public static Set<String> allDocumentAndImageExtensions() {
        return Set.of("pdf", "ppt", "pptx", "png", "jpg", "jpeg", "webp");
    }

    private String extractExtension(String fileName) {
        int dot = fileName.lastIndexOf('.');
        if (dot < 0 || dot == fileName.length() - 1) return "";
        return fileName.substring(dot + 1).toLowerCase();
    }
}
