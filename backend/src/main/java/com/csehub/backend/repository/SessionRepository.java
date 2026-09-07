package com.csehub.backend.repository;

import com.csehub.backend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findAllByOrderByCreatedAtDesc();

    List<Session> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);

    long countByCategoryId(Long categoryId);

    @Query("""
            SELECT DISTINCT s FROM Session s
            LEFT JOIN s.tags t
            WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(CAST(s.content AS string)) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(t.name) LIKE LOWER(CONCAT('%', :q, '%'))
            ORDER BY s.createdAt DESC
            """)
    List<Session> search(@Param("q") String query);
}
