package com.csehub.backend.repository;

import com.csehub.backend.entity.Resource;
import com.csehub.backend.entity.ResourceStatus;
import com.csehub.backend.entity.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findAllByOrderByCreatedAtDesc();

    List<Resource> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);

    List<Resource> findByResourceTypeOrderByCreatedAtDesc(ResourceType resourceType);

    List<Resource> findByStatusOrderByCreatedAtDesc(ResourceStatus status);

    long countByCategoryId(Long categoryId);

    /** All resources whose thumbnailUrl matches, used to check if an uploaded thumbnail file is still referenced. */
    long countByThumbnailUrl(String thumbnailUrl);

    @Query("""
            SELECT DISTINCT r FROM Resource r
            LEFT JOIN r.tags t
            WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(r.description) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(t.name) LIKE LOWER(CONCAT('%', :q, '%'))
            ORDER BY r.createdAt DESC
            """)
    List<Resource> search(@Param("q") String query);
}
