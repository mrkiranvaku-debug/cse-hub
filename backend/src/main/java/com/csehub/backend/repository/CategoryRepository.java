package com.csehub.backend.repository;

import com.csehub.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);

    @Query("""
            SELECT c FROM Category c
            ORDER BY CASE WHEN c.displayOrder IS NULL THEN 999999 ELSE c.displayOrder END ASC, c.id ASC
            """)
    List<Category> findAllOrdered();
}
