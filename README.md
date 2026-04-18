# Quiz Studio

A full-stack quiz application built with **Spring Boot** and **React**, deployed live on the internet.

**Live:** https://quiz-studio.vercel.app

---

## Tech Stack

- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Data JPA** — ORM and database access
- **PostgreSQL** — Relational database
- **React + Vite** — Frontend UI
- **Lombok** — Boilerplate code reduction
- **Maven** — Build and dependency management

---

## Project Structure

```
src/main/java/com/example/quizapp/
├── QuizappApplication.java          # Application entry point
├── controller/
│   ├── QuestionController.java      # REST endpoints for questions
│   └── QuizController.java          # REST endpoints for quizzes
├── dao/
│   ├── QuestionDao.java             # JPA repository for Question entity
│   └── QuizDao.java                 # JPA repository for Quiz entity
├── model/
│   ├── Question.java                # Question entity (JPA)
│   ├── QuestionWrapper.java         # DTO — hides correct answer from users
│   ├── Quiz.java                    # Quiz entity (JPA)
│   └── Response.java                # DTO — user's answer submission
└── service/
    ├── QuestionService.java         # Business logic for questions
    └── QuizService.java             # Business logic for quizzes

frontend/
├── src/App.jsx                     # Main frontend flow
├── src/api/                        # Fetch helpers for backend calls
├── src/components/                 # Simple UI components
└── package.json                    # Frontend dependencies and scripts
```

---

## Data Model

### Question

| Field           | Type    | Description                     |
| --------------- | ------- | ------------------------------- |
| id              | Integer | Auto-generated primary key      |
| questionTitle   | String  | The question text               |
| option1         | String  | First answer option             |
| option2         | String  | Second answer option            |
| option3         | String  | Third answer option             |
| option4         | String  | Fourth answer option            |
| rightAnswer     | String  | The correct answer              |
| difficultyLevel | String  | Difficulty (e.g., Easy, Medium) |
| category        | String  | Category (e.g., Java, Python)   |

### Quiz

| Field     | Type            | Description                            |
| --------- | --------------- | -------------------------------------- |
| id        | Integer         | Auto-generated primary key             |
| title     | String          | Quiz title                             |
| questions | List\<Question> | Many-to-Many relationship to questions |

---

## API Endpoints

### Question Endpoints (`/Question`)

| Method | Endpoint                        | Description                        |
| ------ | ------------------------------- | ---------------------------------- |
| GET    | `/Question/allQuestions`        | Retrieve all questions             |
| GET    | `/Question/category/{category}` | Get questions filtered by category |
| POST   | `/Question/add`                 | Add a new question                 |
| PUT    | `/Question/update/{id}`         | Update an existing question by ID  |
| DELETE | `/Question/delete/{id}`         | Delete a question by ID            |

#### Add a Question — `POST /Question/add`

**Request Body:**

```json
{
  "questionTitle": "What is the size of int in Java?",
  "option1": "1 byte",
  "option2": "2 bytes",
  "option3": "4 bytes",
  "option4": "8 bytes",
  "rightAnswer": "4 bytes",
  "difficultyLevel": "Easy",
  "category": "Java"
}
```

#### Update a Question — `PUT /Question/update/{id}`

**Request Body:**

```json
{
  "questionTitle": "What is the default value of int in Java?",
  "option1": "0",
  "option2": "null",
  "option3": "1",
  "option4": "undefined",
  "rightAnswer": "0",
  "difficultyLevel": "Easy",
  "category": "Java"
}
```

#### Delete a Question — `DELETE /Question/delete/{id}`

**Example:**

```
DELETE /Question/delete/5
```

**Response:** `"Question deleted successfully"` with HTTP 200, or `"Failed to delete Question"` with HTTP 400.

### Quiz Endpoints (`/quiz`)

| Method | Endpoint            | Description                                         |
| ------ | ------------------- | --------------------------------------------------- |
| POST   | `/quiz/create`      | Create a quiz with random questions from a category |
| GET    | `/quiz/get/{id}`    | Get quiz questions (without correct answers)        |
| POST   | `/quiz/submit/{id}` | Submit answers and get the score                    |

#### Create a Quiz — `POST /quiz/create`

**Query Parameters:**

| Parameter | Type   | Description                     |
| --------- | ------ | ------------------------------- |
| category  | String | Question category to pull from  |
| numQ      | int    | Number of questions in the quiz |
| title     | String | Title for the quiz              |

**Example:**

```
POST /quiz/create?category=Java&numQ=5&title=Java Basics Quiz
```

**Response Example:**

```json
{
  "message": "Quiz created successfully",
  "quizId": 1,
  "title": "Java Basics Quiz",
  "questionCount": 5
}
```

#### Get Quiz Questions — `GET /quiz/get/{id}`

Returns questions wrapped in `QuestionWrapper` (without the correct answer), so users cannot see the right answer before submitting.

**Response:**

```json
[
  {
    "id": 1,
    "questionTitle": "What is the size of int in Java?",
    "option1": "1 byte",
    "option2": "2 bytes",
    "option3": "4 bytes",
    "option4": "8 bytes"
  }
]
```

#### Submit Quiz — `POST /quiz/submit/{id}`

**Request Body:**

```json
[
  { "id": 1, "response": "4 bytes" },
  { "id": 2, "response": "JVM" }
]
```

**Response:** Returns the number of correct answers as an integer.

---

## Prerequisites

- **Java 17** or higher
- **PostgreSQL** installed and running
- **Maven** (or use the included Maven wrapper)
- **Node.js** and **npm**

---

## Database Configuration

The backend connects to PostgreSQL. It now supports environment variables with local fallbacks:

```properties
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/postgres}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:0000}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

This means:

- local development can still use the default values
- deployment can override them with `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`

> Hibernate's `ddl-auto=update` will automatically create/update tables based on the entity classes.

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd quiz-spring
   ```

2. **Set up PostgreSQL**
   - Create or use an existing PostgreSQL database.
   - Either use the default local values or set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.

3. **Run the backend**

   ```bash
   ./mvnw spring-boot:run
   ```

   The backend runs on **http://localhost:8080** by default.

4. **Run the frontend**

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

   The frontend runs on **http://localhost:5173** by default.

   You can change the backend URL with:

   ```text
   VITE_API_BASE_URL
   ```

5. **Open the frontend**

   Visit:

   ```text
   http://localhost:5173
   ```

## How It Works — 3-Step Flow

The UI is designed around a clear preparation → exam flow:

| Step | Section | What you do |
|------|---------|-------------|
| Step 1 | **Question Bank** | Add and manage questions stored in PostgreSQL |
| Step 2 | **Create Your Quiz** | Generate a quiz by filtering category and difficulty |
| Step 3 | **Take Exam** | Pick a saved quiz, answer all questions, submit for score |

## Deployment

| Layer | Platform | URL |
|-------|----------|-----|
| Frontend (React) | Vercel | https://quiz-studio.vercel.app |
| Backend (Spring Boot) | Railway | https://frontend-and-backend-quiz-app-production.up.railway.app |
| Database (PostgreSQL) | Railway | Internal to Railway project |

The backend connects to the Railway PostgreSQL database via private network using Railway reference variables. No external database service required.

## Testing

Backend tests use:

- **JUnit 5**
- **Mockito**
- **Spring Boot Test**

Run the backend tests with:

```bash
./mvnw test
```

Run the frontend production build check with:

```bash
cd frontend
npm run build
```

---

## Screenshots

### Frontend UI

| Screenshot                                                          | Description                              |
| ------------------------------------------------------------------- | ---------------------------------------- |
| ![Home Page](Screenshot/Home%20page.png)                            | Dashboard with stats and quick actions   |
| ![Home Page Bottom](Screenshot/Home%20page%20.png)                  | Dashboard cards for all sections         |
| ![Browse Questions](Screenshot/All%20Questions.png)                 | View all questions with answers shown    |
| ![Filter by Category](Screenshot/Question%20Filter.png)             | Filter questions by category dropdown    |
| ![Delete Question](Screenshot/Delete%20question.png)                | Delete confirmation dialog               |
| ![Add Question](Screenshot/Add%20Question.png)                      | Add a new question form                  |
| ![Create Quiz](Screenshot/Create%20new%20Question.png)              | Build a quiz with filters                |
| ![Saved Quizzes](Screenshot/Saved%20Quiz.png)                       | Quiz library with take/delete options    |
| ![Take Quiz](Screenshot/Test-%20Exam.png)                          | Taking a quiz with radio button answers  |
| ![Quiz Result](Screenshot/Result%20calculation.png)                 | Score result after submission             |

### Database PostgreSQL

| Screenshot                                                                  | Description                              |
| --------------------------------------------------------------------------- | ---------------------------------------- |
| ![Quiz DB](Screenshot%20postgresql/Quiz%20DB.png)                           | Quiz-Question join table in pgAdmin      |
| ![Quiz Table](Screenshot%20postgresql/Quiz%20Table.png)                     | Quiz table with saved quizzes            |
| ![Question Table](Screenshot%20postgresql/Question%20Table.png)             | Question table with all questions        |
| ![Question-Quiz](Screenshot%20postgresql/Question-Quiz.png)                 | Quiz-Question relationship data          |

### Postman API Testing (Old)

| Screenshot                                                                  | Description                     |
| --------------------------------------------------------------------------- | ------------------------------- |
| ![Add Question](Screenshot%20Postman/add-question.png)                      | Adding a new question           |
| ![All Questions](Screenshot%20Postman/findall.png)                          | Fetching all questions          |
| ![By Category](Screenshot%20Postman/findall-category.png)                   | Filtering questions by category |
| ![Category Java](Screenshot%20Postman/category_java.png)                    | Java category questions         |
| ![Get Quiz](Screenshot%20Postman/get-1.png)                                 | Retrieving quiz questions       |
| ![201 Created](Screenshot%20Postman/210-created.png)                        | Successful creation response    |
| ![404 Not Found](Screenshot%20Postman/404-not%20found.png)                  | Not found error                 |

---

## License

This project is for educational purposes.
