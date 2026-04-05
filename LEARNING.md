# Learning Notes

This file is only for understanding the project.

From now on, we can keep adding your questions here with simple answers so you can study the project later without searching through the chat.

## Q1 - How is the frontend connected to the backend?

### Short answer

The frontend does not talk to PostgreSQL directly.

The flow is:

`React frontend -> Spring Boot backend -> PostgreSQL database`

Then the result comes back like this:

`PostgreSQL database -> Spring Boot backend -> React frontend`

### Where the frontend sends requests

The frontend request code is mainly inside:

- `frontend/src/api/questions.js`
- `frontend/src/api/quiz.js`

These files use `fetch(...)` to call the backend API.

Example:

- `fetchAllQuestions()` calls `http://localhost:8080/Question/allQuestions`
- `createQuestion(...)` calls `http://localhost:8080/Question/add`
- `createQuiz(...)` calls `http://localhost:8080/quiz/create`
- `fetchQuizQuestions(...)` calls `http://localhost:8080/quiz/get/{id}`

### How the frontend knows the backend URL

Both API files use this idea:

```js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
```

This means:

- if `VITE_API_BASE_URL` exists, use it
- otherwise use `http://localhost:8080`

So during local development, your frontend usually talks to the backend on port `8080`.

### What happens when a user clicks something

The frontend UI is made with React components.

The main screen logic is in:

- `frontend/src/App.jsx`

Example:

1. The user clicks `Add Question`
2. The form collects the data
3. `handleCreateQuestion(...)` runs in `App.jsx`
4. That function calls `createQuestion(...)` from `frontend/src/api/questions.js`
5. `createQuestion(...)` sends a `POST` request to the backend
6. The backend saves the question in PostgreSQL
7. The backend returns a response
8. The frontend updates the screen

So the React component does not save data by itself. It only sends requests and shows results.

### Where the backend receives the requests

The backend endpoints are mainly inside:

- `src/main/java/com/example/quizapp/controller/QuestionController.java`
- `src/main/java/com/example/quizapp/controller/QuizController.java`

Examples:

- `@GetMapping("allQuestions")` returns all questions
- `@PostMapping("add")` adds a question
- `@PostMapping("create")` creates a quiz
- `@GetMapping("get/{id}")` returns quiz questions
- `@PostMapping("submit/{id}")` checks quiz answers and returns the score

### What happens after the controller

The controller does not usually do all the work itself.

It passes work to the service layer:

- `QuestionController -> QuestionService`
- `QuizController -> QuizService`

Then the service layer talks to the database layer:

- `QuestionService -> QuestionDao`
- `QuizService -> QuizDao`

Then Spring Data / JPA talks to PostgreSQL.

### Why the browser is allowed to connect

Your frontend and backend run on different ports:

- frontend: `http://localhost:5173`
- backend: `http://localhost:8080`

Normally, browsers block many cross-origin requests.

This project allows them through:

- `src/main/java/com/example/quizapp/config/WebConfig.java`

That file enables CORS for the frontend ports.

Without that, the browser would often block the frontend from calling the backend.

### Most important idea

The frontend is only the user interface.

It:

- shows forms
- sends requests
- receives responses
- updates the screen

The backend is the part that:

- contains business logic
- validates requests
- creates quizzes
- calculates scores
- reads and writes PostgreSQL data

### Simple examples from this project

#### Example 1 - View questions

Flow:

`QuestionList page -> fetchAllQuestions() -> GET /Question/allQuestions -> QuestionController -> QuestionService -> QuestionDao -> PostgreSQL`

#### Example 2 - Create a quiz

Flow:

`CreateQuizForm -> createQuiz() -> POST /quiz/create -> QuizController -> QuizService -> QuestionDao / QuizDao -> PostgreSQL`

#### Example 3 - Submit a quiz

Flow:

`QuizPlayer -> submitQuiz() -> POST /quiz/submit/{id} -> QuizController -> QuizService -> score calculation -> response returned to frontend`

### What you should remember

If someone asks how your full-stack app works, the best short explanation is:

1. React shows the interface.
2. React sends HTTP requests to Spring Boot.
3. Spring Boot handles the logic.
4. Spring Boot reads/writes PostgreSQL.
5. The backend sends JSON responses back to React.
6. React updates the page using that response.

### Next learning questions we can add here

Good topics for the next notes:

- how `App.jsx` controls the whole frontend
- how `useState` and `useEffect` are used in this project
- how the `api` folder works
- how quiz creation works step by step
- how quiz submission calculates the result
- how validation works in the backend
- how CORS works
