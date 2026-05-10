# JWT Authentication Design — Teacher & Student Roles

**Date:** 2026-05-09
**Approach:** JWT + localStorage (Option A)

---

## Overview

Add JWT-based authentication to the quiz app with two roles:
- **TEACHER** — full access to all endpoints and full UI
- **STUDENT** — can only view quizzes, take quizzes, and see results

Anyone can register and self-select their role. Token is stored in localStorage and sent with every API request via `Authorization: Bearer <token>` header. On token expiry (401), the app auto-redirects to the login page.

---

## Backend

### New Files

```
src/main/java/com/example/quizapp/
  model/
    User.java              ← JPA entity: id, username, password, role
    Role.java              ← enum: ROLE_TEACHER, ROLE_STUDENT

  dao/
    UserRepository.java    ← extends JpaRepository, findByUsername()

  security/
    JwtUtil.java           ← generateToken(), validateToken(), extractUsername(), extractRole()
    JwtAuthFilter.java     ← OncePerRequestFilter: reads header, validates token, sets SecurityContext
    SecurityConfig.java    ← SecurityFilterChain: public routes, role-based rules, registers JwtAuthFilter

  controller/
    AuthController.java    ← POST /api/auth/register, POST /api/auth/login

  service/
    AuthService.java       ← register() hashes password with BCrypt, login() verifies and returns token
```

### New Dependencies (pom.xml)

- `spring-boot-starter-security`
- `jjwt-api`
- `jjwt-impl`
- `jjwt-jackson`

### application.properties additions

```
jwt.secret=<256-bit-secret-key>
jwt.expiration=86400000
```

### Endpoint Permissions

| Endpoint | Public | Teacher | Student |
|---|---|---|---|
| POST /api/auth/register | ✅ | ✅ | ✅ |
| POST /api/auth/login | ✅ | ✅ | ✅ |
| POST /Question/add | | ✅ | |
| DELETE /Question/delete/{id} | | ✅ | |
| PUT /Question/update/{id} | | ✅ | |
| GET /Question/allQuestions | | ✅ | |
| GET /Question/category/{category} | | ✅ | |
| POST /quiz/create | | ✅ | |
| DELETE /quiz/delete/{id} | | ✅ | |
| GET /quiz/all | | ✅ | ✅ |
| GET /quiz/get/{id} | | ✅ | ✅ |
| POST /quiz/submit/{id} | | ✅ | ✅ |

### Token Payload

```json
{
  "sub": "username",
  "role": "ROLE_TEACHER",
  "iat": 1715000000,
  "exp": 1715086400
}
```

---

## Frontend

### New Files

```
frontend/src/
  api/
    auth.js              ← login(), register() fetch calls

  components/
    LoginPage.jsx        ← username + password form, same purple theme
    RegisterPage.jsx     ← username + password + role dropdown (Teacher/Student), same purple theme
```

### Modified Files

```
frontend/src/
  App.jsx                ← check token on load, decode role, show teacher or student UI, handle 401
  api/questions.js       ← add Authorization header to all requests
  api/quiz.js            ← add Authorization header to all requests
```

### UI by Role

**Teacher UI** — full current app:
- Home, Questions, Add Question, Create Quiz, Saved Quizzes, Take Quiz, Result

**Student UI** — restricted:
- Saved Quizzes (pick a quiz), Take Quiz, Result

### Token Handling

- Store: `localStorage.setItem('token', token)`
- Read: `localStorage.getItem('token')`
- Decode role: `JSON.parse(atob(token.split('.')[1]))` — no library needed
- Clear + redirect on 401: `localStorage.removeItem('token')` → show LoginPage

### App Load Flow

```
App loads
  → token in localStorage?
    no  → show LoginPage
    yes → decode role
            ROLE_TEACHER → Teacher UI
            ROLE_STUDENT → Student UI

LoginPage submits
  → POST /api/auth/login
  → save token
  → decode role → route to correct UI

RegisterPage submits
  → POST /api/auth/register
  → redirect to LoginPage

Any API call returns 401
  → clear token → show LoginPage
```

---

## Styling

Login and Register pages use the same warm cream theme, fonts, and component style as the existing app:
- Background: `#fff9ef` → `#f5efe5` with orange/blue radial accents (from `index.css`)
- Text: `#203040`
- Font: `Satoshi`, `Avenir Next`, `Segoe UI`

No new design system or CSS framework introduced.

---

## Out of Scope

- Refresh tokens (token lasts 24 hours, user logs in again after expiry)
- Admin role
- Email verification
- Password reset
- Teacher creating student accounts
