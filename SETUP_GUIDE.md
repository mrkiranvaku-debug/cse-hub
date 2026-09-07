# CSE Hub — Setup Guide

This project has two parts that run separately: a **Spring Boot backend** (Java + MySQL)
and a **React frontend** (Vite + TypeScript). Both need to be running at the same time.

> **Note on this build:** the code was written and the frontend was fully installed,
> type-checked and production-built in the environment that created it — that part is
> verified working. The Java backend could **not** be compiled in that same environment
> because it has no access to Maven Central, so you should do a first build on your own
> machine before relying on it. The steps below tell you exactly how, and what to do if
> anything needs fixing.
>
> **Update:** the backend no longer uses Lombok. It was originally written with Lombok
> annotations (`@Getter`/`@Setter`/`@RequiredArgsConstructor`) for brevity, but Lombok's
> annotation processor did not work under a very new, non-LTS JDK (26), silently producing
> zero generated methods and ~73 "cannot find symbol" errors. All getters, setters, and
> constructors are now hand-written directly in the entity, DTO, service, and controller
> classes — no annotation processing is involved, so the build no longer depends on
> Lombok/JDK compatibility at all and will compile on any JDK 17+.

---

## 0. Prerequisites

Install these first if you don't already have them:

| Tool     | Version                               | Check with        |
| -------- | ------------------------------------- | ----------------- |
| Java JDK | 17+                                   | `java -version`   |
| Maven    | 3.9+ (or use the wrapper — see below) | `mvn -version`    |
| MySQL    | 8.0+                                  | `mysql --version` |
| Node.js  | 18+                                   | `node -v`         |
| npm      | 9+                                    | `npm -v`          |

If you use **IntelliJ IDEA**, **VS Code with the Java Extension Pack**, or **Spring Tool
Suite**, you can skip installing Maven separately and just open the `backend/` folder —
the IDE will handle dependencies.

---

## 1. Set up MySQL

Start your local MySQL server, then create the database:

```sql
CREATE DATABASE cse_hub;
```

That's it — the backend will create all the tables automatically on first run
(`spring.jpa.hibernate.ddl-auto=update`) and seed some starter categories, resources and
sessions the first time it starts.

**Update your credentials.** Open `backend/src/main/resources/application.properties`
and change these two lines to match your local MySQL setup:

```properties
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

---

## 2. Run the backend

From the `backend/` folder:

```bash
cd backend
mvn spring-boot:run
```

If you don't have Maven installed globally, generate the wrapper once (requires Maven
installed just this one time, or do it from an IDE) — or simply open the folder in
IntelliJ/VS Code and run `BackendApplication.java` directly.

The API will start on **http://localhost:8080**. Verify it's working:

```bash
curl http://localhost:8080/api/categories
```

You should see a JSON array of seeded categories (Java, DSA, SQL & DBMS, Full Stack,
Spring Boot, AI & Agents, Projects, Career, Opportunities, Certifications, Inbox).

### If the backend fails to build or start

- **"Unknown database 'cse_hub'"** — you skipped step 1, or the connection URL doesn't
  match. The URL already has `createDatabaseIfNotExist=true`, so this is usually a
  credentials issue.
- **"Access denied for user"** — fix the username/password in `application.properties`.
- **Port 8080 already in use** — change `server.port=8080` in `application.properties`
  to something else (e.g. `8081`), and update `VITE_API_URL` in `frontend/.env` to match.
- **Dependency download errors** — Maven needs internet access to Maven Central the
  first time it runs, to download Spring Boot and the MySQL connector. Make sure your
  machine isn't behind a firewall blocking `repo.maven.apache.org`.

---

## 3. Run the frontend

In a **separate terminal**, from the `frontend/` folder:

```bash
cd frontend
npm install
npm run dev
```

This was already run once during development, so `npm install` and `npm run build`
are both confirmed to complete cleanly. The dev server will start on
**http://localhost:5173** — open that in your browser.

The frontend talks to the backend at the URL configured in `frontend/.env`:

```
VITE_API_URL=http://localhost:8080/api
```

Change this if you changed the backend's port.

---

## 4. Using the app

- **Home** shows a Japanese-woodblock-inspired banner and your most recently saved
  resources, 4 per row on desktop.
- Click the **☰ menu icon** (top left) to open the sidebar — Learning categories,
  other categories, and recent sessions.
- Click **Add Resource** (top right) to save a new link, video, course, article, etc.
  You can now also switch to **Upload File** to save a PDF, PPT/PPTX, or image directly,
  and attach/replace a thumbnail image on any resource.
- Click any **category** in the sidebar to see everything saved under it, with
  type/status filters.
- Click any **card** to see its full details, edit it, or delete it (with confirmation).
- Use the **search bar** in the header to search resource titles/descriptions/tags and
  session titles/content at once.
- Go to **Sessions** (via the sidebar) to create and read longer-form notes.
- Go to **Customize CSE Hub** (bottom of the sidebar) to:
  - Add, rename, delete, and reorder **categories** — deleting a category that still has
    resources or sessions requires picking another category to move them into first, so
    nothing is ever silently deleted.
  - Edit the home page **greeting, subtitle, and motivational quote**.
  - Upload a custom **banner image** and change its title/tagline, or reset to the
    default animated hero.

None of the above requires a code change or a restart — everything is stored in MySQL
and takes effect immediately.

---

## 5. Building for production

**Frontend:**

```bash
cd frontend
npm run build
```

Outputs static files to `frontend/dist/` — deploy this to any static host (Vercel,
Netlify, Nginx, etc.). Update `VITE_API_URL` to your deployed backend URL before
building.

**Backend:**

```bash
cd backend
mvn clean package
java -jar target/backend-1.0.0.jar
```

---

## Project structure

```
backend/
  src/main/java/com/csehub/backend/
    controller/    REST endpoints
    service/       Business logic
    repository/    Spring Data JPA repositories
    entity/        JPA entities (Category, Resource, Session, Tag)
    dto/           Request/response objects
    exception/     Centralized error handling
    config/        CORS configuration
  src/main/resources/
    application.properties   Database + server config
    data.sql                 Idempotent starter data

frontend/
  src/
    components/    Sidebar, Header, Banner, cards, modals
    pages/         Home, CategoryPage, SessionsPage, SessionDetailPage, Search
    layouts/       MainLayout (sidebar + header shell)
    hooks/         useResources, useCategories, useSessions
    services/      Typed API clients (axios)
    types/         Shared TypeScript types matching backend DTOs
    context/       Toast notifications
```

## REST API reference

| Method | Endpoint                                      | Description                                                                      |
| ------ | --------------------------------------------- | -------------------------------------------------------------------------------- |
| GET    | `/api/resources?categoryId=&type=&status=&q=` | List/filter/search resources                                                     |
| GET    | `/api/resources/{id}`                         | Get one resource                                                                 |
| POST   | `/api/resources`                              | Create a resource                                                                |
| PUT    | `/api/resources/{id}`                         | Update a resource                                                                |
| DELETE | `/api/resources/{id}`                         | Delete a resource                                                                |
| GET    | `/api/sessions?categoryId=&q=`                | List/filter/search sessions                                                      |
| GET    | `/api/sessions/{id}`                          | Get one session                                                                  |
| POST   | `/api/sessions`                               | Create a session                                                                 |
| PUT    | `/api/sessions/{id}`                          | Update a session                                                                 |
| DELETE | `/api/sessions/{id}`                          | Delete a session                                                                 |
| GET    | `/api/categories`                             | List categories                                                                  |
| POST   | `/api/categories`                             | Create a category                                                                |
| PUT    | `/api/categories/{id}`                        | Update a category                                                                |
| DELETE | `/api/categories/{id}`                        | Delete a category (`?reassignToId=` required if it still has resources/sessions) |
| PUT    | `/api/categories/reorder`                     | Persist a new category order (JSON array of ids)                                 |
| GET    | `/api/tags`                                   | List all tag names                                                               |
| POST   | `/api/resources/upload`                       | Create a resource from an uploaded PDF/PPT/PPTX/image (multipart)                |
| PUT    | `/api/resources/{id}/file`                    | Replace the uploaded file behind an existing resource (multipart)                |
| POST   | `/api/resources/{id}/thumbnail`               | Upload/replace a resource's thumbnail image (multipart)                          |
| DELETE | `/api/resources/{id}/thumbnail`               | Remove a resource's thumbnail                                                    |
| GET    | `/api/settings`                               | Get home page + banner customization                                             |
| PUT    | `/api/settings`                               | Update greeting/subtitle/quote/banner text                                       |
| POST   | `/api/settings/banner`                        | Upload/replace the banner image (multipart)                                      |
| DELETE | `/api/settings/banner`                        | Reset the banner to the default hero                                             |

## Uploaded files

PDF/PPT/PPTX/image resource files, resource thumbnails, and the banner image
are stored on local disk under `backend/uploads/` (created automatically on
first run) and served back at `http://localhost:8080/uploads/...`. This
folder is created **relative to whatever directory you run the backend
from** — so start it the same way each time (e.g. always `cd backend && mvn
spring-boot:run` from the repo) or your uploaded files will appear to go
missing after a restart from a different working directory. The max upload
size is 25MB (configurable via `spring.servlet.multipart.max-file-size` in
`application.properties`).
