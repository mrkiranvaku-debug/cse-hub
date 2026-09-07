-- ==========================================================
-- CSE Hub - Seed data
-- Runs automatically after Hibernate creates the schema.
-- Every insert is guarded so re-running the app never duplicates rows.
-- ==========================================================

INSERT INTO categories (name, icon, group_name, description)
SELECT * FROM (SELECT 'Java' AS name, '☕' AS icon, 'LEARNING' AS group_name, 'Core Java language notes and resources.' AS description) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Java');

INSERT INTO categories (name, icon, group_name, description)
SELECT * FROM (SELECT 'DSA', '🧠', 'LEARNING', 'Data structures, algorithms and problem-solving patterns.') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'DSA');

INSERT INTO categories (name, icon, group_name, description)
SELECT * FROM (SELECT 'SQL & DBMS', '🗄️', 'LEARNING', 'Databases, SQL queries and DBMS concepts.') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'SQL & DBMS');

INSERT INTO categories (name, icon, group_name, description)
SELECT * FROM (SELECT 'Full Stack', '🌐', 'LEARNING', 'Frontend, backend and everything in between.') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Full Stack');

INSERT INTO categories (name, icon, group_name, description)
SELECT * FROM (SELECT 'Spring Boot', '🍃', 'LEARNING', 'Spring Boot framework notes and references.') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Spring Boot');

INSERT INTO categories (name, icon, group_name, description)
SELECT * FROM (SELECT 'AI & Agents', '🤖', NULL, 'AI, LLMs and autonomous agent ideas.') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'AI & Agents');

INSERT INTO categories (name, icon, group_name, description)
SELECT * FROM (SELECT 'Projects', '🛠️', NULL, 'Project ideas and things to build.') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Projects');

INSERT INTO categories (name, icon, group_name, description)
SELECT * FROM (SELECT 'Career', '🚀', NULL, 'Career planning, resumes and interview prep.') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Career');

INSERT INTO categories (name, icon, group_name, description)
SELECT * FROM (SELECT 'Opportunities', '🏆', NULL, 'Internships, hackathons and other opportunities.') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Opportunities');

INSERT INTO categories (name, icon, group_name, description)
SELECT * FROM (SELECT 'Certifications', '📜', NULL, 'Certificates earned or in progress.') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Certifications');

INSERT INTO categories (name, icon, group_name, description)
SELECT * FROM (SELECT 'Inbox', '📥', NULL, 'Unsorted items to file away later.') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Inbox');

-- Backfill display_order for any category created before the reordering
-- feature existed. Safe to re-run: only touches rows that still have no
-- explicit order, never deletes or overwrites a user-chosen order.
UPDATE categories SET display_order = id WHERE display_order IS NULL;

-- Backfill source_type for any resource created before file uploads existed.
-- They were always link-based, so this is a safe, non-destructive default.
UPDATE resources SET source_type = 'LINK' WHERE source_type IS NULL;

-- ---- Tags ----
INSERT INTO tags (name) SELECT 'arrays' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'arrays');
INSERT INTO tags (name) SELECT 'sliding-window' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'sliding-window');
INSERT INTO tags (name) SELECT 'streams' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'streams');
INSERT INTO tags (name) SELECT 'joins' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'joins');
INSERT INTO tags (name) SELECT 'rest-api' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'rest-api');
INSERT INTO tags (name) SELECT 'agents' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'agents');

-- ---- Sample resources ----
INSERT INTO resources (title, description, url, thumbnail_url, category_id, resource_type, status, created_at, updated_at)
SELECT 'Sliding Window Patterns', 'A clear walkthrough of fixed and variable-size sliding window techniques for array problems.',
       'https://leetcode.com/', NULL, c.id, 'ARTICLE', 'LEARNING', NOW(), NOW()
FROM categories c WHERE c.name = 'DSA'
AND NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Sliding Window Patterns');

INSERT INTO resources (title, description, url, thumbnail_url, category_id, resource_type, status, created_at, updated_at)
SELECT 'Java Streams Deep Dive', 'How map, filter, reduce and collectors work under the hood in the Java Streams API.',
       'https://docs.oracle.com/', NULL, c.id, 'DOCUMENTATION', 'TO_LEARN', NOW(), NOW()
FROM categories c WHERE c.name = 'Java'
AND NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Java Streams Deep Dive');

INSERT INTO resources (title, description, url, thumbnail_url, category_id, resource_type, status, created_at, updated_at)
SELECT 'Spring Boot REST API Course', 'Build production-ready REST APIs with Spring Boot, JPA and MySQL from scratch.',
       'https://spring.io/guides', NULL, c.id, 'COURSE', 'LEARNING', NOW(), NOW()
FROM categories c WHERE c.name = 'Spring Boot'
AND NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Spring Boot REST API Course');

INSERT INTO resources (title, description, url, thumbnail_url, category_id, resource_type, status, created_at, updated_at)
SELECT 'SQL Joins Explained', 'INNER, LEFT, RIGHT and FULL joins with visual diagrams and query examples.',
       'https://www.postgresql.org/docs/', NULL, c.id, 'ARTICLE', 'COMPLETED', NOW(), NOW()
FROM categories c WHERE c.name = 'SQL & DBMS'
AND NOT EXISTS (SELECT 1 FROM resources WHERE title = 'SQL Joins Explained');

INSERT INTO resources (title, description, url, thumbnail_url, category_id, resource_type, status, created_at, updated_at)
SELECT 'Building an AI Agent Architecture', 'Notes on planning, tool-use and memory loops for autonomous LLM agents.',
       'https://github.com/', NULL, c.id, 'GITHUB', 'REFERENCE', NOW(), NOW()
FROM categories c WHERE c.name = 'AI & Agents'
AND NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Building an AI Agent Architecture');

INSERT INTO resources (title, description, url, thumbnail_url, category_id, resource_type, status, created_at, updated_at)
SELECT 'Summer Software Engineering Internship', 'Application tracker and notes for an upcoming internship cycle.',
       NULL, NULL, c.id, 'INTERNSHIP', 'TO_LEARN', NOW(), NOW()
FROM categories c WHERE c.name = 'Opportunities'
AND NOT EXISTS (SELECT 1 FROM resources WHERE title = 'Summer Software Engineering Internship');

-- ---- Sample sessions ----
INSERT INTO sessions (title, category_id, content, created_at, updated_at)
SELECT 'Sliding Window Explanation', c.id,
       'The sliding window pattern maintains a moving subrange over an array or string to avoid recomputation. Fixed-size windows keep a constant width; variable-size windows grow and shrink based on a condition.',
       NOW(), NOW()
FROM categories c WHERE c.name = 'DSA'
AND NOT EXISTS (SELECT 1 FROM sessions WHERE title = 'Sliding Window Explanation');

INSERT INTO sessions (title, category_id, content, created_at, updated_at)
SELECT 'Two Pointer Technique', c.id,
       'Two pointers move toward or away from each other across a sorted structure, commonly used for pair-sum and partition problems.',
       NOW(), NOW()
FROM categories c WHERE c.name = 'DSA'
AND NOT EXISTS (SELECT 1 FROM sessions WHERE title = 'Two Pointer Technique');

INSERT INTO sessions (title, category_id, content, created_at, updated_at)
SELECT 'Java Streams Discussion', c.id,
       'Streams provide a declarative way to process collections. Intermediate operations like map and filter are lazy; terminal operations like collect trigger execution.',
       NOW(), NOW()
FROM categories c WHERE c.name = 'Java'
AND NOT EXISTS (SELECT 1 FROM sessions WHERE title = 'Java Streams Discussion');

INSERT INTO sessions (title, category_id, content, created_at, updated_at)
SELECT 'Spring Boot Controller/Service/Repository', c.id,
       'The Controller layer handles HTTP, the Service layer holds business logic, and the Repository layer talks to the database through Spring Data JPA.',
       NOW(), NOW()
FROM categories c WHERE c.name = 'Spring Boot'
AND NOT EXISTS (SELECT 1 FROM sessions WHERE title = 'Spring Boot Controller/Service/Repository');

INSERT INTO sessions (title, category_id, content, created_at, updated_at)
SELECT 'AI Agent Architecture', c.id,
       'A typical agent loop: perceive context, plan next action, call a tool, observe the result, and update memory before repeating.',
       NOW(), NOW()
FROM categories c WHERE c.name = 'AI & Agents'
AND NOT EXISTS (SELECT 1 FROM sessions WHERE title = 'AI Agent Architecture');

INSERT INTO sessions (title, category_id, content, created_at, updated_at)
SELECT 'SQL Joins', c.id,
       'INNER JOIN returns matching rows only; LEFT JOIN keeps all left-table rows; FULL OUTER JOIN keeps everything from both sides.',
       NOW(), NOW()
FROM categories c WHERE c.name = 'SQL & DBMS'
AND NOT EXISTS (SELECT 1 FROM sessions WHERE title = 'SQL Joins');
