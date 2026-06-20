<div align="center">

# QueryConnect

**A full-stack community Q&A platform for product discussions.**  
Ask questions about products, post answers, reply to comments, like the best responses, and discover trending topics — all in one place.

[![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.5-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat-square&logo=angular)](https://angular.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap)](https://getbootstrap.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#features) · [Tech Stack](#tech-stack) · [Quick Start](#quick-start) · [API Docs](#api-endpoints) · [Architecture](#architecture)

</div>

---

## What is QueryConnect?

QueryConnect is a **community-driven Q&A platform** where users can ask questions tied to specific products, post and reply to answers in threaded discussions, like helpful responses, search across all questions, and track platform-wide stats. Built as a monorepo with a **Spring Boot REST API** (backend) and an **Angular 19** application (frontend).

---

## Features

### Questions
- Post questions with a title, detailed content, label (tag), and product association
- Browse all questions or filter by product, label, author, or date range
- View your own submitted questions on a personal dashboard
- Close a question once it has been resolved

### Answers & Comments
- Post answers (comments) on any question
- Reply to any comment for threaded discussions
- Approve the best answer — marks it as the accepted response

### Likes
- Like any comment or answer
- Toggle like/unlike with real-time count updates
- See bulk like counts for multiple comments in a single request

### Products
- Browse all registered products
- Get product details by ID
- Questions are linked to products via `productCode`

### Platform Stats
- Live stats: total users, total questions, total closed questions, total comments
- Public endpoint — no login required

### Auth & Security
- JWT-based authentication (HS256, 24h expiry)
- Auto token injection on every request via Angular HTTP Interceptor
- Auto-redirect to login on 401 via same interceptor
- Route protection with Angular `AuthGuard`
- Public endpoints: browse questions, search, view comments, view products, stats
- Protected endpoints: post question, reply, like, close question

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Language (LTS) |
| Spring Boot | 3.4.5 | Framework, embedded Tomcat |
| Spring Security | 6 | Stateless JWT filter chain |
| Spring Data JPA | 3.x | ORM, repository layer |
| Hibernate | 6 | JPA implementation, MySQL8Dialect |
| MySQL | 8.0 | Relational database |
| JJWT | 0.11.5 | JWT generation + validation (HS256) |
| BCrypt | — | Password hashing |
| Spring Validation | — | Bean Validation (`@Valid`, `@NotBlank`, `@Email`) |
| Maven | 3.x | Build tool (mvnw wrapper) |
| Docker | — | Multi-stage build (JDK → JRE) |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Angular | 19.2 | SPA framework, standalone components |
| TypeScript | 5.7 | Language |
| Angular Router | 19 | Client-side routing with AuthGuard |
| Angular HTTP Client | 19 | HTTP with functional interceptors |
| Bootstrap | 5.3.5 | Responsive UI components |
| Bootstrap Icons | 1.11.3 | SVG icon library |
| jwt-decode | 4.0.0 | Decode JWT payload client-side |
| RxJS | 7.8 | Reactive streams for async data |
| Karma + Jasmine | — | Unit testing |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser                                │
│              Angular 19 SPA                                 │
│     (TypeScript · Bootstrap 5 · RxJS)                       │
│                    Port 4200                                │
└────────────────────────┬────────────────────────────────────┘
                         │  HTTP/JSON
                         │  Authorization: Bearer <jwt>
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                Spring Boot 3.4.5                            │
│   JwtAuthenticatorFilter → Controller → Service → Repo      │
│                    Port 8081                                │
└────────────────────────┬────────────────────────────────────┘
                         │  JDBC / JPA
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   MySQL 8.0                                 │
│           Database: product_community_db                    │
│                    Port 3306                                │
└─────────────────────────────────────────────────────────────┘
```

**Request lifecycle:**
1. Angular `authInterceptor` (functional) attaches `Authorization: Bearer <token>` from localStorage
2. Spring's `JwtAuthenticatorFilter` validates the token on every request
3. Controller delegates to service layer
4. Service enforces business rules (author-only for close, owner-only for approve)
5. On 401 response: interceptor calls `authService.logout()` → redirects to `/login`

---

## Project Structure

```
QueryConnect/
├── backend/                              Spring Boot REST API
│   ├── src/main/java/com/community/productcommunity/
│   │   ├── ProductCommunityBackendApplication.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java       JWT filter chain, CORS (env-configurable)
│   │   ├── controller/                   6 controllers
│   │   │   ├── AuthController.java        /api/auth/*
│   │   │   ├── QuestionController.java    /api/questions/*
│   │   │   ├── CommentController.java     /api/comments/*
│   │   │   ├── LikeController.java        /api/likes/*
│   │   │   ├── ProductController.java     /api/products/*
│   │   │   └── StatController.java        /api/stats
│   │   ├── dto/                          Request + Response DTOs
│   │   │   ├── AuthResponse.java          { token, email, firstName, lastName }
│   │   │   ├── LoginRequest.java          { email, password }
│   │   │   ├── RegisterRequest.java       { email, password, firstName, lastName }
│   │   │   ├── QuestionRequest.java       { title, content, label, productCode }
│   │   │   ├── QuestionResponse.java      Flattened question + comments
│   │   │   ├── CommentRequest.java        { questionId, content }
│   │   │   ├── CommentResponse.java       Flattened comment + author + likes + replies
│   │   │   ├── ReplyRequest.java          { content }
│   │   │   ├── StatsResponse.java         { totalUsers, totalQuestions, ... }
│   │   │   └── UserDTO.java               { uid, email, firstName, lastName }
│   │   ├── model/                        5 JPA entities
│   │   │   ├── User.java
│   │   │   ├── Question.java
│   │   │   ├── Comment.java              (supports parent/reply threading)
│   │   │   ├── Like.java                 (unique constraint: user + comment)
│   │   │   └── Product.java
│   │   ├── repository/                   5 Spring Data JPA repositories
│   │   ├── security/
│   │   │   ├── JwtAuthenticatorFilter.java   OncePerRequestFilter
│   │   │   └── UserDetailsServiceImpl.java
│   │   └── service/                      7 services
│   │       ├── JWTService.java            Token generation + validation
│   │       ├── UserService.java
│   │       ├── QuestionService.java
│   │       ├── CommentService.java
│   │       ├── LikeService.java
│   │       ├── ProductService.java
│   │       └── StatService.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                             Angular 19 SPA
│   ├── src/app/
│   │   ├── app.routes.ts                 Route definitions with AuthGuard
│   │   ├── app.config.ts                 provideRouter, provideHttpClient + interceptors
│   │   ├── components/
│   │   │   ├── login/                    Login form
│   │   │   ├── register/                 Register form
│   │   │   ├── homepage/                 Authenticated home — recent questions, stats
│   │   │   ├── ask-question/             Post new question form
│   │   │   ├── view-questions/           Browse all questions
│   │   │   ├── view-details/             Single question detail with comments
│   │   │   └── search/                   Search questions by multiple filters
│   │   ├── services/
│   │   │   ├── auth.service.ts           Login, logout, token storage (BehaviorSubject)
│   │   │   ├── question.service.ts       Question CRUD + search + stats
│   │   │   └── like.service.ts           Toggle like, get counts, bulk counts
│   │   ├── guards/
│   │   │   └── auth.guard.ts             Protects /home and /ask-question routes
│   │   └── interceptors/
│   │       └── auth.interceptor.ts       Attaches Bearer token, handles 401 → logout
│   ├── Dockerfile                        Multi-stage: node build → nginx serve
│   └── package.json
│
├── docker-compose.yml                    MySQL + Backend + Frontend (3 containers)
├── .env.example                          All required environment variables
└── README.md
```

---

## API Endpoints

### Auth — `/api/auth` (Public)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register — returns JWT |
| POST | `/api/auth/login` | Login — returns JWT |

**Register/Login response:**
```json
{ "token": "eyJ...", "email": "user@example.com", "firstName": "Harsh", "lastName": "Soni" }
```

---

### Questions — `/api/questions`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/questions` | Public | All questions |
| GET | `/api/questions/{id}` | Public | Single question with comments |
| GET | `/api/questions/search` | Public | Search by title, productCode, email, label, dateFrom, dateTo |
| GET | `/api/questions/my` | Required | My posted questions |
| POST | `/api/questions` | Required | Post a new question |
| PUT | `/api/questions/{id}/close` | Required | Mark question as resolved (`status: true`) |

**Question object:**
```json
{
  "qid": 1,
  "username": "Harsh Soni",
  "email": "harsh@example.com",
  "datePosted": "2025-12-01T10:00:00",
  "title": "How do I reset my device?",
  "content": "I tried holding the button but...",
  "status": false,
  "label": "hardware",
  "productCode": "PROD-001",
  "comments": [ ... ]
}
```

**Search params** (all optional):
```
?title=reset&productCode=PROD-001&email=harsh@example.com&label=hardware&dateFrom=2025-01-01T00:00:00&dateTo=2025-12-31T23:59:59
```

---

### Comments — `/api/comments`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/comments/{questionId}` | Public | All comments for a question |
| POST | `/api/comments` | Required | Post a top-level comment |
| POST | `/api/comments/reply/{parentCommentId}` | Required | Reply to a comment (threaded) |
| PUT | `/api/comments/{commentId}/approve` | Required | Approve/accept a comment as best answer |

**Comment object:**
```json
{
  "cid": 1,
  "content": "You need to hold for 10 seconds.",
  "datePosted": "2025-12-01T11:00:00",
  "status": false,
  "author": { "uid": 2, "email": "bob@example.com", "firstName": "Bob", "lastName": "Smith" },
  "replies": [ ... ],
  "likeCount": 5
}
```

---

### Likes — `/api/likes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/likes/toggle/{commentId}` | Required | Toggle like/unlike — returns `{ liked, likeCount }` |
| GET | `/api/likes/count/{commentId}` | Public | Like count for one comment |
| GET | `/api/likes/status/{commentId}` | Required | Has current user liked this comment? |
| POST | `/api/likes/counts` | Public | Bulk like counts — body: `[1, 2, 3, ...]` |
| GET | `/api/likes/comment/{commentId}` | Public | All likes on a comment |
| GET | `/api/likes/user/{userId}` | Public | All likes by a user |

**Unique constraint:** A user can only like a comment once (`UNIQUE(user_id, comment_id)`).

---

### Products — `/api/products` (Public)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | All products |
| GET | `/api/products/{id}` | Single product by ID |

**Product object:** `{ "id": 1, "productName": "SmartWatch X1", "productCode": "PROD-001" }`

---

### Stats — `/api/stats` (Public)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stats` | Platform-wide stats |

```json
{ "totalUsers": 120, "totalQuestions": 340, "totalClosedQuestions": 85, "totalComments": 910 }
```

---

## Data Model

```
User ──── posts many ──────────────────► Question
  │                                          │
  │ posts many                         has many │
  ▼                                          ▼
Comment ◄──── belongs to question ──── Question
  │
  ├── has many ──► Comment (self-ref, replies)
  └── has many ──► Like

Like: User ↔ Comment  (unique per pair)
Product: standalone — linked to Question via productCode (string)
```

### Entity Details

**`User`** — `id (Long, IDENTITY)`, `email (unique)`, `password (@JsonIgnore, BCrypt)`, `firstName`, `lastName`

**`Question`** — `qid (Long, IDENTITY)`, `user (ManyToOne)`, `title`, `content (TEXT)`, `status (Boolean, default false)`, `label`, `productCode`, `datePosted`, `comments (OneToMany, cascade ALL)`

**`Comment`** — `cid (Long, IDENTITY)`, `user (ManyToOne)`, `question (ManyToOne)`, `content (TEXT)`, `datePosted`, `status (Boolean, default false — approved)`, `parentComment (ManyToOne self-ref, nullable)`, `replies (OneToMany)`, `likes (OneToMany)`

**`Like`** — `lid (Long, IDENTITY)`, `user (ManyToOne)`, `comment (ManyToOne)`, `UNIQUE(user_id, comment_id)`

**`Product`** — `id (Long, IDENTITY)`, `productName`, `productCode (unique)`

---

## Security

### JWT Token
- **Algorithm:** HS256
- **Subject:** user's email
- **Claims:** `firstName`, `lastName`
- **Expiry:** configurable via `JWT_EXPIRATION` (default 24h)
- **Key:** Base64-decoded secret from `JWT_SECRET` env var

### `JwtAuthenticatorFilter` (`OncePerRequestFilter`)
Extracts `Bearer` token from header → validates → sets `SecurityContextHolder` authentication.

### CORS
Configured via `CORS_ALLOWED_ORIGINS` env var (comma-separated). Allows `GET/POST/PUT/DELETE/OPTIONS` with `Authorization`, `Content-Type`, `Accept` headers.

### Public vs Protected
**Public (no token needed):**
- `GET /api/questions`, `/api/questions/{id}`, `/api/questions/search`
- `GET /api/comments/{questionId}`
- `GET /api/likes/count/{id}`, `/api/likes/comment/{id}`
- `POST /api/likes/counts`
- `GET /api/products/**`
- `GET /api/stats`
- `POST /api/auth/**`

**Protected (token required):**
- Post/close questions, post/reply/approve comments, toggle like, get like status

---

## Quick Start

### Option 1 — Docker (Recommended)

Requires: [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
git clone https://github.com/harshcode1/QueryConnect.git
cd QueryConnect

cp .env.example .env
# Edit .env — set DB_PASSWORD, DB_ROOT_PASSWORD, and JWT_SECRET

docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8081 |
| MySQL | localhost:3306 |

---

### Option 2 — Local Development

**Prerequisites:** Java 17+, Maven, Node.js 20+, Angular CLI 19, MySQL 8

**1. Database**
```sql
CREATE DATABASE product_community_db;
```

**2. Backend**
```bash
cd backend
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export JWT_SECRET=your-base64-encoded-secret
./mvnw spring-boot:run
# API running at http://localhost:8081
```

**3. Frontend**
```bash
cd frontend
npm install
npm start
# App running at http://localhost:4200
```

---

## Angular Routes

| Path | Component | Guard |
|---|---|---|
| `/login` | `LoginComponent` | — |
| `/register` | `RegisterComponent` | — |
| `/home` | `HomepageComponent` | AuthGuard |
| `/ask-question` | `AskQuestionComponent` | AuthGuard |
| `/view-questions` | `ViewQuestionsComponent` | — |
| `/view-details/:id` | `ViewDetailsComponent` | — |
| `/search` | `SearchComponent` | — |
| `/**` | redirect → `/login` | — |

---

## Environment Variables

| Variable | Required | Default | Notes |
|---|---|---|---|
| `DB_URL` | Yes | `jdbc:mysql://localhost:3306/product_community_db` | JDBC URL |
| `DB_USERNAME` | Yes | `root` | MySQL user |
| `DB_PASSWORD` | Yes | — | ⚠️ Must set |
| `DB_ROOT_PASSWORD` | Docker only | — | MySQL root password |
| `JWT_SECRET` | Yes | — | ❌ Must set — Base64-encoded, min 32 chars |
| `JWT_EXPIRATION` | No | `86400000` | Token TTL in ms (default 24h) |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:4200` | Comma-separated allowed origins |
| `SERVER_PORT` | No | `8081` | Backend port |

---

## Running Tests

### Frontend (Karma + Jasmine)
```bash
cd frontend
npm test
```

### Backend (JUnit)
```bash
cd backend
./mvnw test
```

---

## Key Design Decisions

**Monorepo** — Frontend and backend in one repo: single clone, unified CI/CD config, one place for environment variables.

**Stateless JWT** — No server-side sessions. Token stored in localStorage. Angular interceptor attaches it to every request. On 401: interceptor calls `authService.logout()` and redirects to `/login` automatically.

**Env-configurable CORS** — Unlike many starter projects, CORS origins are driven by `CORS_ALLOWED_ORIGINS` env var — works out of the box for any deployment domain.

**Threaded comments** — `Comment` has a self-referential `parentComment (ManyToOne)` + `replies (OneToMany)` — enables nested discussion threads without a separate `Reply` entity.

**Unique like constraint** — `UNIQUE(user_id, comment_id)` enforced at the database level — prevents duplicate likes even under concurrent requests.

**Functional Angular interceptor** — Uses Angular 19's `HttpInterceptorFn` (not class-based) — the modern standalone approach that works without `NgModule`.

**Public read, auth write** — Browse questions and comments without an account. Only posting, liking, and managing content requires login — improves discoverability.

---

## Author

**Harsh Soni**  
[GitHub](https://github.com/harshcode1) · [LinkedIn](https://linkedin.com/in/harshsoni9995)

---

<div align="center">
  <sub>Built with Spring Boot · Angular · MySQL · Docker</sub>
</div>
