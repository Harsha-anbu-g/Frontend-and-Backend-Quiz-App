# Work Log

## Session Timeline

### 2026-03-16

1. Reviewed the existing backend structure without changing code
2. Created the first version of `PLAN.md`
3. Created `WORKLOG.md`
4. Installed reusable skills globally outside the project
5. Expanded `PLAN.md` into a more detailed implementation guide
6. Added the Phase 1 backend review summary to `PLAN.md`
7. Replaced field injection with constructor injection
8. Improved missing-record and error handling in the service layer
9. Added CORS configuration and environment-based database settings
10. Added request validation for question and quiz input
11. Added global exception handling for cleaner API errors
12. Added service-level backend tests and ran the test suite
13. Created the React frontend scaffold with Vite
14. Replaced the starter UI with the first real quiz app screen
15. Added a simple Add Question frontend flow
16. Added the simple end-to-end quiz flow in the frontend
17. Polished the quiz submission UX and updated the README
18. Added question category filtering and manual refresh in the frontend
19. Cleaned up backend config warnings and verified the full project again
20. Cleaned repo hygiene items and added a simple demo flow to the README
21. Finished final polish and removed unused starter assets
22. Completed the final autonomous pass and re-verified the whole project
23. Fixed quiz creation reliability by normalizing category handling
24. Fixed the quiz loading 500 error caused by lazy-loaded quiz questions
25. Added a saved quizzes tab so existing quizzes can be reopened later
26. Added quiz deletion from the saved quizzes tab and PostgreSQL
27. Added question deletion from the question list and PostgreSQL
28. Added difficulty filtering to quiz creation
29. Added an Any category option so quizzes can be filtered by difficulty only
30. Replaced development placeholder text on the homepage with project-facing text
31. Redesigned the frontend into a home page with client-facing navigation

## Purpose

This file explains what I am doing in the project so you can review it, read it later, and understand the upgrade process step by step.

## How To Read This File

Use these sections to quickly understand the current state:

- `Reviewed only`: things I inspected but did not change
- `Changed`: files I actually created or edited
- `Next if approved`: work that is planned but not yet done

This should make it easier for you to separate analysis from real edits.

## Current Rules We Are Following

- Do not change code without your permission
- It is okay to add documentation files when you ask for them
- Explain the work clearly before making larger code changes

## Reviewed Only

### 1. Read the existing backend

I reviewed the current Spring Boot project structure and looked at:

- Controllers
- Services
- Repositories
- Models
- README
- Application configuration

This was only for understanding the project. No backend code was changed.

### 2. Reviewed the current backend quality

These are observations only:

- The project already has a working Spring Boot REST structure
- The backend is understandable and can be extended
- The database is currently configured for local PostgreSQL
- Several future upgrades would improve maintainability and frontend readiness

## Changed

### Step 2 - 2026-03-16 - Created a project plan

I added a planning file to the project:

- `PLAN.md`

This file now contains:

- the project goal
- the current backend snapshot
- the future file map
- the implementation phases
- the likely backend upgrade order

### Step 3 - 2026-03-16 - Created this work log

I added:

- `WORKLOG.md`

This file is meant to track what was reviewed, what changed, and what needs approval.

### Step 5 - 2026-03-16 - Expanded the plan for implementation review

I updated:

- `PLAN.md`

The plan now includes:

- current backend snapshot
- future file map
- implementation phase checklists
- backend upgrade order
- Phase 1 review summary

### Step 7 - 2026-03-16 - Applied the first backend refactor

I updated these files:

- `src/main/java/com/example/quizapp/controller/QuestionController.java`
- `src/main/java/com/example/quizapp/controller/QuizController.java`
- `src/main/java/com/example/quizapp/service/QuestionService.java`
- `src/main/java/com/example/quizapp/service/QuizService.java`

What changed:

- removed field injection with `@Autowired`
- added constructor injection with `private final` dependencies

Why:

- dependencies are now explicit
- the code is easier to understand and test
- this matches common Spring Boot best practices

### Step 8 - 2026-03-16 - Improved missing-record and error handling

I updated these files:

- `src/main/java/com/example/quizapp/service/QuestionService.java`
- `src/main/java/com/example/quizapp/service/QuizService.java`

What changed:

- deleting a missing question now returns `404 Not Found`
- loading a missing quiz now returns `404 Not Found` instead of failing with `.get()`
- submitting quiz answers for a missing quiz now returns `404 Not Found`
- quiz scoring now matches answers by question id instead of relying on list order

Why:

- the backend now fails more safely
- API behavior is clearer for a future frontend
- quiz result calculation is more reliable

### Step 9 - 2026-03-16 - Added CORS and environment-based database config

I updated these files:

- `src/main/java/com/example/quizapp/config/WebConfig.java`
- `src/main/resources/application.properties`

What changed:

- added a global CORS configuration for local frontend development
- allowed frontend requests from `http://localhost:5173` and `http://localhost:3000`
- changed database settings to read from environment variables when available
- kept the current local PostgreSQL values as defaults

Why:

- the future frontend can call the backend from a different local port
- deployment is easier because database values can now come from the hosting platform
- local development still works without forcing deployment setup right now

### Step 10 - 2026-03-16 - Added request validation for question and quiz input

I updated these files:

- `pom.xml`
- `src/main/java/com/example/quizapp/controller/QuestionController.java`
- `src/main/java/com/example/quizapp/controller/QuizController.java`
- `src/main/java/com/example/quizapp/model/Question.java`
- `src/main/java/com/example/quizapp/model/Response.java`

What changed:

- added Spring validation dependency
- added `@Valid` to controller request bodies
- added required-field validation to `Question`
- added required-field validation to quiz `Response`

Why:

- bad or incomplete input is now rejected earlier
- the backend is safer before frontend integration
- the API contract is clearer for future forms and requests

### Step 11 - 2026-03-16 - Added global exception handling for cleaner API errors

I updated these files:

- `src/main/java/com/example/quizapp/model/ErrorResponse.java`
- `src/main/java/com/example/quizapp/controller/GlobalExceptionHandler.java`

What changed:

- added a reusable error response model
- added a global handler for validation errors
- added a fallback global handler for unexpected exceptions

Why:

- validation errors now return a clearer JSON structure
- unexpected failures are easier to understand during frontend integration
- the API is becoming more consistent for future clients

### Step 12 - 2026-03-16 - Added service-level backend tests and ran the test suite

I updated these files:

- `src/test/java/com/example/quizapp/service/QuestionServiceTest.java`
- `src/test/java/com/example/quizapp/service/QuizServiceTest.java`

What changed:

- added tests for deleting a missing question
- added tests for deleting an existing question
- added tests for missing quiz lookup
- added tests for wrapped quiz questions
- added tests for missing quiz submission
- added tests for scoring by question id instead of request order

Verification:

- ran `./mvnw -q test`
- tests passed

Note:

- Maven and Mockito printed JVM warnings during the test run
- those warnings did not fail the build

### Step 13 - 2026-03-16 - Created the React frontend scaffold with Vite

I added:

- `frontend/`

What changed:

- scaffolded a separate React app with Vite
- installed the frontend dependencies
- verified the default frontend build

Verification:

- ran `npm install` in `frontend`
- ran `npm run build` in `frontend`
- frontend build passed

Why:

- the project now has a dedicated place for the future UI
- backend and frontend remain separated cleanly
- we can start building pages without affecting the Spring Boot structure

### Step 14 - 2026-03-16 - Replaced the starter UI with the first real quiz app screen

I updated these files:

- `frontend/src/App.jsx`
- `frontend/src/App.css`
- `frontend/src/index.css`
- `frontend/src/api/questions.js`
- `frontend/src/components/QuestionList.jsx`

What changed:

- removed the default Vite starter page
- added a quiz-themed dashboard layout
- added a small API helper for loading questions from the backend
- added a reusable question list component
- connected the frontend to `/Question/allQuestions`

Verification:

- ran `npm run build` in `frontend`
- frontend build passed

Why:

- the frontend now has a real starting point
- the app can already read live backend data
- future pages can build on this structure instead of the default template

### Step 15 - 2026-03-16 - Added a simple Add Question frontend flow

I updated these files:

- `frontend/src/App.jsx`
- `frontend/src/App.css`
- `frontend/src/api/questions.js`
- `frontend/src/components/QuestionForm.jsx`

What changed:

- added a simple two-button view switcher
- kept the frontend in one easy-to-explain app flow instead of adding routing
- added a question form that posts to `POST /Question/add`
- refreshes the question list after a successful question creation

Verification:

- ran `npm run build` in `frontend`
- frontend build passed

Why:

- this is the first full frontend create/read flow
- the code stays simple enough to explain to someone else
- it avoids unnecessary complexity like a router at this stage

### Step 16 - 2026-03-16 - Added the simple end-to-end quiz flow in the frontend

I updated these files:

- `src/main/java/com/example/quizapp/model/QuizCreateResponse.java`
- `src/main/java/com/example/quizapp/controller/QuizController.java`
- `src/main/java/com/example/quizapp/service/QuizService.java`
- `frontend/src/App.jsx`
- `frontend/src/App.css`
- `frontend/src/api/quiz.js`
- `frontend/src/components/CreateQuizForm.jsx`
- `frontend/src/components/QuizPlayer.jsx`

What changed:

- backend quiz creation now returns the created quiz id and title
- added a simple `Create Quiz` frontend flow
- added a simple `Take Quiz` frontend flow
- added a result screen that shows the score after submission
- kept the frontend in a single easy-to-follow app flow without a router

Verification:

- ran `./mvnw -q test`
- backend tests passed
- ran `npm run build` in `frontend`
- frontend build passed

Why:

- the project now supports the main quiz flow from frontend to backend
- the UI is still simple enough to explain step by step
- quiz creation can move directly into quiz answering without manual id lookup

### Step 17 - 2026-03-16 - Polished the quiz submission UX and updated the README

I updated these files:

- `frontend/src/components/QuizPlayer.jsx`
- `README.md`

What changed:

- quiz submission now shows how many questions are answered
- submit is disabled until every question has an answer
- README now explains the backend and frontend setup together
- README now documents environment-based database configuration and current frontend features

Verification:

- ran `./mvnw -q test`
- backend tests passed
- ran `npm run build` in `frontend`
- frontend build passed

Why:

- the quiz flow is easier for a user to understand
- the project is easier to explain and run from the README

### Step 18 - 2026-03-16 - Added question category filtering and manual refresh in the frontend

I updated these files:

- `frontend/src/api/questions.js`
- `frontend/src/App.jsx`
- `frontend/src/App.css`

What changed:

- added a category filter for the question list
- connected the frontend to the existing backend category endpoint
- added a manual refresh button for reloading question data

Verification:

- ran `npm run build` in `frontend`
- frontend build passed

Why:

- browsing questions is easier when there are multiple categories
- the change reuses an existing backend endpoint
- the UI stays simple and easy to explain

### Step 19 - 2026-03-16 - Cleaned up backend config warnings and verified the full project again

I updated these files:

- `src/main/java/com/example/quizapp/controller/QuizController.java`
- `src/main/resources/application.properties`

What changed:

- removed unused imports from `QuizController`
- removed the explicit Hibernate dialect setting
- set `spring.jpa.open-in-view=false`

Verification:

- ran `./mvnw -q test`
- backend tests passed
- ran `npm run lint` in `frontend`
- frontend lint passed
- ran `npm run build` in `frontend`
- frontend build passed

Why:

- the backend configuration output is cleaner
- the code has less dead or unused structure
- the project is in a better final state for review and explanation

### Step 20 - 2026-03-16 - Cleaned repo hygiene items and added a simple demo flow to the README

I updated these files:

- `.gitignore`
- `README.md`

What changed:

- added `.DS_Store` to `.gitignore`
- removed project-level `.DS_Store` files from the working tree
- added a short demo flow section to the README

Note:

- one `.DS_Store` still exists inside `.git/`
- that is not part of the project source, so I left it alone

Why:

- the repo is cleaner for review
- the README is easier to use for a quick project demo explanation

### Step 21 - 2026-03-16 - Finished final polish and removed unused starter assets

I updated these files:

- `frontend/src/App.jsx`
- `frontend/src/App.css`
- `frontend/.env.example`
- `README.md`
- `src/test/java/com/example/quizapp/service/QuizServiceTest.java`

I also removed:

- `frontend/src/assets/hero.png`
- `frontend/src/assets/react.svg`
- `frontend/src/assets/vite.svg`

What changed:

- category options now stay available more reliably in the frontend
- success notices stay visible after important actions
- added a frontend environment example file
- added backend test coverage for quiz creation behavior
- removed unused Vite starter assets

Verification:

- ran `./mvnw -q test`
- backend tests passed
- ran `npm run lint` in `frontend`
- frontend lint passed
- ran `npm run build` in `frontend`
- frontend build passed

Why:

- the project is cleaner and easier to explain
- the frontend no longer carries unused starter leftovers
- the final state is closer to a finished student project

### Step 22 - 2026-03-16 - Completed the final autonomous pass and re-verified the whole project

I updated these files:

- `frontend/src/App.jsx`
- `frontend/src/App.css`
- `frontend/.env.example`
- `README.md`
- `src/test/java/com/example/quizapp/service/QuizServiceTest.java`
- `WORKLOG.md`

What changed:

- improved frontend notices so successful actions are easier to see
- made category options more reliable by loading them from the full question list
- added an example frontend environment file
- added more backend test coverage for quiz creation
- removed unused starter assets and finished the final cleanup

Verification:

- ran `./mvnw -q test`
- backend tests passed
- ran `npm run lint` in `frontend`
- frontend lint passed
- ran `npm run build` in `frontend`
- frontend build passed

Final state:

- backend is improved and tested
- frontend supports the full main user flow
- README, PLAN, and WORKLOG are up to date
- project is ready for demo and explanation

### Step 23 - 2026-03-16 - Fixed quiz creation reliability by normalizing category handling

I updated these files:

- `src/main/java/com/example/quizapp/dao/QuestionDao.java`
- `src/main/java/com/example/quizapp/service/QuestionService.java`
- `src/test/java/com/example/quizapp/service/QuestionServiceTest.java`
- `frontend/src/App.jsx`
- `frontend/src/components/CreateQuizForm.jsx`
- `frontend/src/App.css`
- `WORKLOG.md`

What was wrong:

- stored category values were mixed like `java` and `Java`
- quiz creation was matching category text too strictly
- the create quiz form used free text, which made it easy to type a category that did not match the stored data exactly

What changed:

- backend question category lookups are now case-insensitive
- random quiz question lookup is now case-insensitive and trims category text
- question saving normalizes category values to lowercase
- the frontend create-quiz form now uses a category dropdown instead of free text
- category options are built more reliably from the full question list

Verification:

- ran `./mvnw -q test`
- backend tests passed
- ran `npm run lint` in `frontend`
- frontend lint passed
- ran `npm run build` in `frontend`
- frontend build passed
- restarted the backend dev server so the fix is active

Why:

- quiz creation is now much more reliable
- users no longer need to guess the exact category spelling or case

### Step 24 - 2026-03-16 - Fixed the quiz loading 500 error after quiz creation

I updated these files:

- `src/main/java/com/example/quizapp/dao/QuizDao.java`
- `src/main/java/com/example/quizapp/service/QuizService.java`
- `src/test/java/com/example/quizapp/service/QuizServiceTest.java`
- `WORKLOG.md`

What was wrong:

- quiz creation itself worked
- loading quiz questions failed with `500`
- the backend was loading `quiz.questions` after the Hibernate session was already closed

What changed:

- added a repository query that fetches a quiz together with its questions
- updated quiz question loading to use that fetch query
- updated quiz result calculation to use the same fetch query
- updated service tests to match the new repository method
- restarted the backend dev server so the running app uses the fix

Verification:

- ran `./mvnw -q test`
- backend tests passed
- created a quiz through `POST /quiz/create`
- loaded the created quiz through `GET /quiz/get/{id}`
- confirmed the live endpoint now returns `200 OK` instead of `500`

Why:

- quiz creation now works all the way through the full frontend flow
- the browser can load quiz questions without hitting the lazy-loading error

### Step 25 - 2026-03-16 - Added a saved quizzes tab for reopening old quizzes

I updated these files:

- `src/main/java/com/example/quizapp/model/QuizSummary.java`
- `src/main/java/com/example/quizapp/dao/QuizDao.java`
- `src/main/java/com/example/quizapp/service/QuizService.java`
- `src/main/java/com/example/quizapp/controller/QuizController.java`
- `src/test/java/com/example/quizapp/service/QuizServiceTest.java`
- `frontend/src/api/quiz.js`
- `frontend/src/components/SavedQuizList.jsx`
- `frontend/src/App.jsx`
- `frontend/src/App.css`
- `WORKLOG.md`

What changed:

- added a backend endpoint to return all saved quizzes
- added a simple quiz summary model with quiz id, title, and question count
- added a new frontend tab called `Saved Quizzes`
- each saved quiz now has a `Take Quiz` button
- creating a new quiz refreshes the saved quiz list automatically

Verification:

- ran `./mvnw -q test`
- backend tests passed
- ran `npm run lint` in `frontend`
- frontend lint passed
- ran `npm run build` in `frontend`
- frontend build passed
- restarted the backend dev server
- confirmed `GET /quiz/all` returns saved quizzes with `200 OK`

Why:

- you can now see quizzes that were already created
- you can reopen and take them later instead of only taking the newest one immediately

### Step 26 - 2026-03-16 - Added quiz deletion from the saved quizzes tab

I updated these files:

- `src/main/java/com/example/quizapp/service/QuizService.java`
- `src/main/java/com/example/quizapp/controller/QuizController.java`
- `src/test/java/com/example/quizapp/service/QuizServiceTest.java`
- `frontend/src/api/quiz.js`
- `frontend/src/components/SavedQuizList.jsx`
- `frontend/src/App.jsx`
- `frontend/src/App.css`
- `WORKLOG.md`

What changed:

- added a backend delete endpoint for quizzes
- added service handling for missing quiz ids and successful deletion
- added frontend delete buttons inside the `Saved Quizzes` tab
- added a browser confirmation before deleting
- if the currently opened quiz is deleted, the app clears that active quiz state

Verification:

- ran `./mvnw -q test`
- backend tests passed
- ran `npm run lint` in `frontend`
- frontend lint passed
- ran `npm run build` in `frontend`
- frontend build passed
- restarted the backend dev server
- created a temporary quiz through `POST /quiz/create`
- deleted that temporary quiz through `DELETE /quiz/delete/{id}`
- confirmed the quiz no longer appears in `GET /quiz/all`

Why:

- you can now clean up old saved quizzes from the UI
- deleting a quiz removes the saved quiz record from PostgreSQL
- question records stay in the question bank, so deleting a quiz does not delete your question library

### Step 27 - 2026-03-16 - Added question deletion from the question list

I updated these files:

- `src/main/java/com/example/quizapp/dao/QuizDao.java`
- `src/main/java/com/example/quizapp/service/QuestionService.java`
- `src/test/java/com/example/quizapp/service/QuestionServiceTest.java`
- `frontend/src/api/questions.js`
- `frontend/src/components/QuestionList.jsx`
- `frontend/src/App.jsx`
- `frontend/src/App.css`
- `WORKLOG.md`

What changed:

- added a delete button to each question card in the frontend
- added a browser confirmation before deleting a question
- wired the frontend to the existing backend delete endpoint
- made backend question deletion remove that question from any saved quizzes before deleting it
- refreshed both the question list and saved quiz list after deletion

Verification:

- ran `./mvnw -q test`
- backend tests passed
- ran `npm run lint` in `frontend`
- frontend lint passed
- ran `npm run build` in `frontend`
- frontend build passed
- restarted the backend dev server
- created a temporary question through `POST /Question/add`
- created a temporary quiz that used that question
- deleted the question through `DELETE /Question/delete/{id}`
- confirmed the question no longer appears in `GET /Question/allQuestions`
- confirmed the saved quiz still exists but now shows `questionCount: 0`

Why:

- you can now remove questions directly from the UI
- deleting a question removes it from PostgreSQL
- any saved quiz using that question is updated so the database stays consistent

### Step 28 - 2026-03-16 - Added difficulty filtering to quiz creation

I updated these files:

- `src/main/java/com/example/quizapp/dao/QuestionDao.java`
- `src/main/java/com/example/quizapp/service/QuizService.java`
- `src/main/java/com/example/quizapp/controller/QuizController.java`
- `src/test/java/com/example/quizapp/service/QuizServiceTest.java`
- `frontend/src/components/CreateQuizForm.jsx`
- `frontend/src/App.jsx`
- `WORKLOG.md`

What changed:

- added an optional difficulty filter to the backend quiz creation flow
- added a repository query for random questions by category and difficulty
- added a difficulty dropdown to the frontend create-quiz form
- loaded available difficulty options from the existing question data
- kept the old behavior when no difficulty is selected

Verification:

- ran `./mvnw -q test`
- backend tests passed
- ran `npm run lint` in `frontend`
- frontend lint passed
- ran `npm run build` in `frontend`
- frontend build passed
- restarted the backend dev server
- confirmed `POST /quiz/create?category=python&difficultyLevel=hard&numQ=1...` returns `201 Created`
- confirmed `POST /quiz/create?category=java&difficultyLevel=hard&numQ=1...` returns `404 Not Found`

Why:

- you can now make quizzes that target a specific difficulty level
- leaving the difficulty empty still creates a quiz from any difficulty, so the old flow still works

### Step 29 - 2026-03-16 - Added an Any category option to quiz creation

I updated these files:

- `src/main/java/com/example/quizapp/dao/QuestionDao.java`
- `src/main/java/com/example/quizapp/service/QuizService.java`
- `src/main/java/com/example/quizapp/controller/QuizController.java`
- `src/test/java/com/example/quizapp/service/QuizServiceTest.java`
- `frontend/src/components/CreateQuizForm.jsx`
- `WORKLOG.md`

What changed:

- added backend support for random questions from:
  - any category and any difficulty
  - any category with a selected difficulty
  - a selected category with any difficulty
  - a selected category with a selected difficulty
- changed the category dropdown in quiz creation to show `Any category`
- kept difficulty as a selectable filter so you can choose only by difficulty when you want
- normalized category and difficulty filters before querying

Verification:

- ran `./mvnw -q test`
- backend tests passed
- ran `npm run lint` in `frontend`
- frontend lint passed
- ran `npm run build` in `frontend`
- frontend build passed
- restarted the backend dev server
- confirmed `POST /quiz/create?category=&difficultyLevel=easy&numQ=2...` returns `201 Created`
- confirmed `POST /quiz/create?category=&difficultyLevel=impossible&numQ=2...` returns `404 Not Found`

Why:

- you can now leave category open and filter only by difficulty
- the quiz form is more flexible without making the UI more complex

### Step 30 - 2026-03-16 - Replaced development placeholder text on the homepage

I updated these files:

- `frontend/src/App.jsx`
- `WORKLOG.md`

What changed:

- replaced the old development-focused homepage text
- changed the hero section so it describes the actual quiz app
- changed the three summary cards so they explain question bank, quiz builder, and saved quiz flow

Verification:

- ran `npm run lint` in `frontend`
- frontend lint passed
- ran `npm run build` in `frontend`
- frontend build passed

Why:

- the old text was left over from the frontend setup phase
- the page now reads more like a real student project and less like an internal progress note

### Step 31 - 2026-03-16 - Redesigned the frontend into a client-facing website layout

I updated these files:

- `frontend/src/App.jsx`
- `frontend/src/App.css`
- `frontend/src/components/HomePage.jsx`
- `WORKLOG.md`

What changed:

- removed the old summary-card section that looked like an internal progress dashboard
- added a real home page with a welcome section and direct action cards
- added a top navigation bar with clear entry points for:
  - home
  - questions
  - add question
  - create quiz
  - saved quizzes
  - take quiz
  - result
- made the non-home sections open inside a cleaner page panel layout
- changed the default starting page from the question list to the new home page

Verification:

- ran `npm run lint` in `frontend`
- frontend lint passed
- ran `npm run build` in `frontend`
- frontend build passed

Why:

- the earlier layout was useful while building features, but it did not feel like a real website for a client
- the new layout makes it obvious where to go for adding questions, creating quizzes, taking tests, and viewing results

### Step 32 - 2026-03-17 - Made the correct answer easier to see in question cards

Changed files:

- `frontend/src/components/QuestionList.jsx`
- `frontend/src/App.css`
- `WORKLOG.md`

What changed:

- kept the correct answer visible inside each question card in the question bank
- changed the answer display from plain text into a clearer labeled badge-style row
- added a fallback text of `Not set` if a stored question has no correct answer value

Verification:

- ran `npm run lint` in `frontend`
- ran `npm run build` in `frontend`

Why:

- the correct answer should be easy to spot when you review saved questions
- the new styling makes the answer line feel like part of the app, not debug text

### Step 33 - 2026-03-17 - Added visible numbering to question cards

Changed files:

- `frontend/src/components/QuestionList.jsx`
- `frontend/src/App.css`
- `WORKLOG.md`

What changed:

- added a `Question 1`, `Question 2`, `Question 3` style label to each question card
- placed the number inside the card header so it is visible before reading the full question
- kept the change simple by using the question list order that is already shown on the page

Verification:

- ran `npm run lint` in `frontend`
- ran `npm run build` in `frontend`

Why:

- numbering makes the question bank easier to explain and reference
- it also helps when reviewing multiple saved questions in one screen

## Installed Globally Outside The Project

These were not added into the repository. They were installed globally on your machine for reuse across projects.

Installed skills:

- `java-springboot`
- `vercel-react-best-practices`
- `webapp-testing`
- `use-railway`
- `notion-spec-to-implementation`
- `find-skills`
- `writing-plans`
- `skill-creator`

## What I Found In The Current Backend

These are still observations only, not code changes:

- field injection with `@Autowired`
- broad exception handling
- direct entity usage in some API responses
- likely missing CORS setup for frontend integration
- local database credentials are hardcoded
- quiz service logic likely needs safer missing-record handling

## Next If Approved

If you approve code changes later, the next safe technical steps would likely be:

1. Approve the first backend improvement step
2. Improve backend structure without changing features
3. Prepare the backend for frontend integration
4. Start the React frontend MVP

## Important Note

When I say I am "starting work", that does not always mean I already changed code.

Sometimes it means:

- reading files
- understanding architecture
- making a plan
- identifying upgrade steps

## Current Status

- Backend code changed: yes
- Documentation files added: yes
- Frontend created: yes
- Deployment started: no

If you want, I can keep updating this file each time we make progress.

### Step 34 - 2026-03-17 - Added a dedicated learning note for project explanations

Changed files:

- `LEARNING.md`
- `WORKLOG.md`

What changed:

- created a new learning file for study notes and future question-and-answer explanations
- added the first topic explaining how the React frontend connects to the Spring Boot backend
- explained the roles of `App.jsx`, the `api` folder, controllers, services, DAOs, CORS, and PostgreSQL in one place

Verification:

- documentation-only change

Why:

- the chat is useful in the moment, but a permanent learning file is easier to review later
- this gives you one study document for frontend/backend understanding without mixing it into the README
