# Quiz App Implementation Plan

**Goal:** Turn the current Spring Boot quiz API into a complete student project with a frontend, safer backend structure, testing, and simple deployment.

**Architecture:** The project will keep a separated backend and frontend structure. The current Spring Boot application remains the API layer, a React frontend will consume that API, and PostgreSQL will remain the database both locally and in production through hosted infrastructure later.

**Tech Stack:** Java 17, Spring Boot, Spring Data JPA, PostgreSQL, Maven, React, Vite

---

## Project Summary

This project already has a working backend for managing questions and quizzes. The main job now is to improve the backend enough to support a frontend cleanly, then build the frontend in small steps, and finally test and deploy the project.

This document is meant to be practical. It should help you answer:

- what we are building
- why we are doing tasks in this order
- which files are likely to change later
- what to review before approving code edits

## Requirements Summary

### Functional Requirements

- Manage questions: create, read, update, delete
- Create quizzes from a category and question count
- Show quiz questions without exposing correct answers
- Submit answers and calculate a score
- Build a frontend for quiz users and basic question management

### Non-Functional Requirements

- Keep the project beginner-friendly and good for learning
- Keep the app simple enough for a student portfolio project
- Support local PostgreSQL development
- Support low-cost public deployment later

### Acceptance Criteria

- A user can create and take a quiz from the frontend
- A user can view a quiz result after submitting answers
- An admin-style page can manage questions
- The backend returns clearer success and error responses
- The app can be deployed with a hosted PostgreSQL database

## Clarifications And Assumptions

- Code changes should be made only with explicit approval
- Documentation files are allowed when requested
- The first frontend version is an MVP, not a polished production interface
- React is the default frontend choice unless you decide otherwise later
- Deployment should target a simple platform such as Railway or Render

## Current System Snapshot

### Backend Structure

Current package layout:

- `src/main/java/com/example/quizapp/controller`
- `src/main/java/com/example/quizapp/service`
- `src/main/java/com/example/quizapp/dao`
- `src/main/java/com/example/quizapp/model`

### Current API Areas

- Question management endpoints
- Quiz creation endpoint
- Quiz retrieval endpoint
- Quiz submission and scoring endpoint

### Current Technical Gaps

These are observations from reading the current codebase:

- field injection with `@Autowired`
- broad `try/catch` usage
- direct entity exposure in some responses
- hardcoded local database credentials
- likely missing CORS configuration for frontend use
- fragile quiz lookup and result logic in some service methods

## File Map For Future Work

These are the main files likely to be reviewed or changed in later phases:

### Backend

- `src/main/java/com/example/quizapp/controller/QuestionController.java`
- `src/main/java/com/example/quizapp/controller/QuizController.java`
- `src/main/java/com/example/quizapp/service/QuestionService.java`
- `src/main/java/com/example/quizapp/service/QuizService.java`
- `src/main/java/com/example/quizapp/dao/QuestionDao.java`
- `src/main/java/com/example/quizapp/dao/QuizDao.java`
- `src/main/java/com/example/quizapp/model/Question.java`
- `src/main/java/com/example/quizapp/model/Quiz.java`
- `src/main/java/com/example/quizapp/model/QuestionWrapper.java`
- `src/main/java/com/example/quizapp/model/Response.java`
- `src/main/resources/application.properties`

### Frontend

These do not exist yet, but a later React app will likely include files such as:

- `frontend/src/App.jsx`
- `frontend/src/pages/HomePage.jsx`
- `frontend/src/pages/QuestionsPage.jsx`
- `frontend/src/pages/CreateQuizPage.jsx`
- `frontend/src/pages/TakeQuizPage.jsx`
- `frontend/src/pages/ResultPage.jsx`
- `frontend/src/components/QuestionForm.jsx`
- `frontend/src/api/quizApi.js`

## Implementation Phases

## Phase 1: Backend Understanding

**Goal:** Understand the current codebase clearly before changing behavior.

**Why this comes first:** Frontend work becomes much easier when the backend behavior is already understood.

**Checklist:**

- [ ] Review controllers and list all endpoints
- [ ] Review service methods and note how each endpoint behaves
- [ ] Review repositories and custom queries
- [ ] Review entities and DTO-like classes
- [ ] Trace one full request from controller to database and back
- [ ] Record weak areas and later upgrade candidates

**Expected output:**

- a simple architecture explanation
- a backend upgrade candidate list

**Likely files involved:**

- `src/main/java/com/example/quizapp/controller/*`
- `src/main/java/com/example/quizapp/service/*`
- `src/main/java/com/example/quizapp/dao/*`
- `src/main/java/com/example/quizapp/model/*`

## Phase 2: Frontend Specification

**Goal:** Decide exactly what the first frontend version should do.

**Why this comes second:** It prevents overbuilding and keeps the MVP realistic.

**Checklist:**

- [ ] Choose target users: admin, quiz taker, or both
- [ ] Choose the frontend stack
- [ ] Define the minimum page list
- [ ] Define the user flow between pages
- [ ] Map each page to backend endpoints
- [ ] Decide what data each page needs to send and receive

**Expected output:**

- page list
- user flow
- endpoint map

**Suggested MVP pages:**

- Home page
- View questions page
- Add question page
- Create quiz page
- Take quiz page
- Result page

## Phase 3: Backend Readiness For Frontend

**Goal:** Make the backend easier and safer for a frontend to use.

**Why this comes before frontend coding:** It reduces avoidable integration bugs.

**Checklist:**

- [ ] Add CORS configuration
- [ ] Improve error handling
- [ ] Add input validation
- [ ] Review response shapes
- [ ] Review update and delete edge cases
- [ ] Move database settings toward environment-based configuration

**Expected output:**

- a frontend-ready backend with clearer API behavior

**Likely files involved:**

- `src/main/java/com/example/quizapp/controller/*`
- `src/main/java/com/example/quizapp/service/*`
- `src/main/resources/application.properties`

## Phase 4: Frontend MVP Build

**Goal:** Build a usable UI connected to the current API.

**Checklist:**

- [ ] Create the React project
- [ ] Set up routing
- [ ] Add a shared API utility
- [ ] Build the page shell and navigation
- [ ] Fetch and show all questions
- [ ] Add a create-question form
- [ ] Add quiz creation
- [ ] Add quiz-taking flow
- [ ] Add results screen

**Expected output:**

- working frontend connected to the backend

## Phase 5: Testing

**Goal:** Reduce regressions and make upgrades safer.

**Checklist:**

- [ ] Add backend controller or service tests
- [ ] Add frontend flow tests
- [ ] Test quiz submission and scoring
- [ ] Test invalid input and not-found cases
- [ ] Keep a short manual test checklist

**Expected output:**

- confidence in the main user flows

## Phase 6: Deployment

**Goal:** Make the project publicly accessible.

**Checklist:**

- [ ] Move sensitive config to environment variables
- [ ] Create a hosted PostgreSQL database
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Verify public connectivity
- [ ] Update README with deployment notes

**Expected output:**

- live demo version of the project

## Suggested Upgrade Order Inside The Backend

When you approve backend code changes, this is the safest order:

1. Replace field injection with constructor injection
2. Improve error handling for missing quiz and question records
3. Add CORS configuration
4. Externalize database configuration
5. Add validation
6. Add tests

This order keeps the project stable while improving code quality gradually.

## Risks And Mitigation

### Risk 1: Frontend work starts before the backend is fully understood

- **Probability:** Medium
- **Impact:** High
- **Mitigation:** Finish Phase 1 first

### Risk 2: Local-only database blocks deployment

- **Probability:** High
- **Impact:** Medium
- **Mitigation:** Switch to hosted PostgreSQL during deployment

### Risk 3: Backend errors are difficult to debug from the frontend

- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:** Improve error handling before integration

## Success Criteria

- You can explain how requests move through the backend
- You know which backend fixes should happen before frontend work
- You have a realistic MVP frontend scope
- You can build the app step by step without guessing
- The final project is demoable online

## Recommended Next Step

Review the backend in Phase 1 and write down:

- current request flow
- endpoint list
- model responsibilities
- first three backend improvements to approve

## Phase 1 Review Summary

### Request Flow

The current request flow follows a standard Spring Boot pattern:

1. A request enters a controller method
2. The controller forwards the request to a service
3. The service performs logic and calls a repository
4. The repository interacts with PostgreSQL through Spring Data JPA
5. The service returns a `ResponseEntity`
6. The controller returns that response to the client

This structure is simple and good for learning because each layer has a mostly clear role.

### Controllers

#### `QuestionController`

Responsible for question-related endpoints:

- `GET /Question/allQuestions`
- `GET /Question/category/{category}`
- `POST /Question/add`
- `DELETE /Question/delete/{id}`
- `PUT /Question/update/{id}`

Current role:

- accept HTTP requests
- pass data into `QuestionService`
- return the service response directly

#### `QuizController`

Responsible for quiz-related endpoints:

- `POST /quiz/create`
- `GET /quiz/get/{id}`
- `POST /quiz/submit/{id}`

Current role:

- accept quiz creation, retrieval, and submission requests
- pass them into `QuizService`
- return the service response directly

### Services

#### `QuestionService`

Current responsibilities:

- fetch all questions
- fetch questions by category
- add a question
- delete a question by id
- update a question by id

Current behavior:

- uses `QuestionDao` directly
- wraps most methods in broad `try/catch`
- returns `ResponseEntity` directly from the service layer

Notes:

- this works, but it mixes business logic with HTTP response handling
- update behavior replaces the full question using the incoming request body

#### `QuizService`

Current responsibilities:

- create a quiz from random questions
- return quiz questions without exposing answers
- calculate the quiz score from submitted responses

Current behavior:

- `createQuiz` gets random questions by category, creates a `Quiz`, and saves it
- `getQuizQuestion` converts `Question` objects into `QuestionWrapper` objects
- `calculateResult` compares submitted responses to stored right answers

Notes:

- this service contains the main quiz-specific business logic
- it currently assumes records always exist and uses `.get()` on `Optional`
- score calculation depends on response order matching question order

### Repositories

#### `QuestionDao`

Provides:

- default CRUD behavior from `JpaRepository`
- `findByCategory(String category)`
- `findRandomQuestionsByCategory(String category, int numQ)`

The custom random query is used for quiz creation.

#### `QuizDao`

Provides:

- default CRUD behavior from `JpaRepository`

### Models

#### `Question`

Represents the question table and stores:

- title
- four options
- right answer
- difficulty level
- category

#### `Quiz`

Represents a quiz and stores:

- quiz title
- many-to-many relationship with questions

#### `QuestionWrapper`

Used to send quiz questions to users without exposing the correct answer.

This is a good design decision in the current codebase.

#### `Response`

Represents a user answer submission:

- question id
- selected response

### Configuration

The database is configured in `application.properties` using local PostgreSQL values.

Current state:

- URL points to local database
- username is hardcoded
- password is hardcoded
- suitable for local development only

### Strengths In The Current Backend

- clear separation between controller, service, repository, and model layers
- simple API structure that is easy to understand
- quiz questions are wrapped to hide answers
- Spring Data JPA removes a lot of boilerplate database code

### Weaknesses In The Current Backend

- field injection instead of constructor injection
- service layer returns HTTP response objects directly
- broad exception handling hides error details
- missing-record handling is fragile in quiz logic
- response scoring assumes submitted answer order matches database question order
- database credentials are hardcoded locally
- CORS configuration is not visible yet for frontend integration

### First Three Backend Improvements To Approve Later

1. Replace field injection with constructor injection
2. Improve missing-record and error handling in `QuizService` and `QuestionService`
3. Add CORS configuration and move toward environment-based database configuration
