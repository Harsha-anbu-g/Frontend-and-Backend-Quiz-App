package com.example.quizapp.service;

import com.example.quizapp.dao.QuestionDao;
import com.example.quizapp.dao.QuizDao;
import com.example.quizapp.model.Question;
import com.example.quizapp.model.QuestionWrapper;
import com.example.quizapp.model.Quiz;
import com.example.quizapp.model.QuizCreateResponse;
import com.example.quizapp.model.QuizSummary;
import com.example.quizapp.model.Response;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizDao quizDao;

    @Mock
    private QuestionDao questionDao;

    @InjectMocks
    private QuizService quizService;

    @Test
    void createQuizReturnsNotFoundWhenNoQuestionsExistForCategory() {
        when(questionDao.findRandomQuestionsByCategory("rust", 3)).thenReturn(List.of());

        var response = quizService.createQuiz("Rust", 3, "Rust Quiz", "");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("No questions found for the selected filters", response.getBody().getMessage());
    }

    @Test
    void createQuizReturnsCreatedQuizDetailsWhenQuestionsExist() {
        Question question = new Question();
        question.setId(1);

        Quiz savedQuiz = new Quiz();
        savedQuiz.setId(12);
        savedQuiz.setTitle("Java Quiz");
        savedQuiz.setQuestions(List.of(question));

        when(questionDao.findRandomQuestionsByCategory("java", 1)).thenReturn(List.of(question));
        when(quizDao.save(any(Quiz.class))).thenReturn(savedQuiz);

        var response = quizService.createQuiz("Java", 1, "Java Quiz", "");

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        QuizCreateResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("Quiz created successfully", body.getMessage());
        assertEquals(12, body.getQuizId());
        assertEquals("Java Quiz", body.getTitle());
        assertEquals(1, body.getQuestionCount());
        verify(quizDao).save(any(Quiz.class));
    }

    @Test
    void createQuizUsesDifficultyFilterWhenProvided() {
        Question question = new Question();
        question.setId(5);

        Quiz savedQuiz = new Quiz();
        savedQuiz.setId(20);
        savedQuiz.setTitle("Python Hard Quiz");
        savedQuiz.setQuestions(List.of(question));

        when(questionDao.findRandomQuestionsByCategoryAndDifficulty("python", "hard", 1))
                .thenReturn(List.of(question));
        when(quizDao.save(any(Quiz.class))).thenReturn(savedQuiz);

        var response = quizService.createQuiz("Python", 1, "Python Hard Quiz", "hard");

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(20, response.getBody().getQuizId());
        verify(quizDao).save(any(Quiz.class));
    }

    @Test
    void createQuizUsesRandomQuestionsWhenNoCategoryOrDifficultyIsProvided() {
        Question question = new Question();
        question.setId(8);

        Quiz savedQuiz = new Quiz();
        savedQuiz.setId(30);
        savedQuiz.setTitle("Mixed Quiz");
        savedQuiz.setQuestions(List.of(question));

        when(questionDao.findRandomQuestions(1)).thenReturn(List.of(question));
        when(quizDao.save(any(Quiz.class))).thenReturn(savedQuiz);

        var response = quizService.createQuiz("", 1, "Mixed Quiz", "");

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(30, response.getBody().getQuizId());
        verify(quizDao).save(any(Quiz.class));
    }

    @Test
    void createQuizUsesDifficultyOnlyFilterWhenCategoryIsAny() {
        Question question = new Question();
        question.setId(9);

        Quiz savedQuiz = new Quiz();
        savedQuiz.setId(31);
        savedQuiz.setTitle("Easy Quiz");
        savedQuiz.setQuestions(List.of(question));

        when(questionDao.findRandomQuestionsByDifficulty("easy", 1)).thenReturn(List.of(question));
        when(quizDao.save(any(Quiz.class))).thenReturn(savedQuiz);

        var response = quizService.createQuiz("", 1, "Easy Quiz", "easy");

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(31, response.getBody().getQuizId());
        verify(quizDao).save(any(Quiz.class));
    }

    @Test
    void getAllQuizzesReturnsSavedQuizSummaries() {
        QuizSummary summary = new QuizSummary(7, "Java Basics Quiz", 3L);
        when(quizDao.findQuizSummaries()).thenReturn(List.of(summary));

        var response = quizService.getAllQuizzes();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Java Basics Quiz", response.getBody().get(0).title());
        assertEquals(3L, response.getBody().get(0).questionCount());
    }

    @Test
    void deleteQuizReturnsNotFoundWhenQuizDoesNotExist() {
        when(quizDao.findById(99)).thenReturn(Optional.empty());

        var response = quizService.deleteQuiz(99);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Quiz not found.", response.getBody());
    }

    @Test
    void deleteQuizRemovesExistingQuiz() {
        Quiz quiz = new Quiz();
        quiz.setId(7);

        when(quizDao.findById(7)).thenReturn(Optional.of(quiz));

        var response = quizService.deleteQuiz(7);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Quiz deleted successfully.", response.getBody());
        verify(quizDao).delete(quiz);
    }

    @Test
    void getQuizQuestionReturnsNotFoundWhenQuizDoesNotExist() {
        when(quizDao.findQuizWithQuestionsById(42)).thenReturn(Optional.empty());

        var response = quizService.getQuizQuestion(42);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void getQuizQuestionReturnsWrappedQuestionsWithoutAnswers() {
        Question question = new Question();
        question.setId(1);
        question.setQuestionTitle("What is Java?");
        question.setOption1("Language");
        question.setOption2("Database");
        question.setOption3("Browser");
        question.setOption4("Cloud");
        question.setRightAnswer("Language");

        Quiz quiz = new Quiz();
        quiz.setQuestions(List.of(question));

        when(quizDao.findQuizWithQuestionsById(1)).thenReturn(Optional.of(quiz));

        var response = quizService.getQuizQuestion(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<QuestionWrapper> wrappers = response.getBody();
        assertEquals(1, wrappers.size());
        assertEquals("What is Java?", wrappers.get(0).getQuestionTitle());
        assertEquals("Language", wrappers.get(0).getOption1());
    }

    @Test
    void calculateResultReturnsNotFoundWhenQuizDoesNotExist() {
        when(quizDao.findQuizWithQuestionsById(5)).thenReturn(Optional.empty());

        var response = quizService.calculateResult(5, List.of());

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(0, response.getBody());
    }

    @Test
    void calculateResultMatchesAnswersByQuestionIdInsteadOfRequestOrder() {
        Question firstQuestion = new Question();
        firstQuestion.setId(10);
        firstQuestion.setRightAnswer("A");

        Question secondQuestion = new Question();
        secondQuestion.setId(20);
        secondQuestion.setRightAnswer("B");

        Quiz quiz = new Quiz();
        quiz.setQuestions(List.of(firstQuestion, secondQuestion));

        Response secondResponse = new Response();
        secondResponse.setId(20);
        secondResponse.setResponse("B");

        Response firstResponse = new Response();
        firstResponse.setId(10);
        firstResponse.setResponse("A");

        when(quizDao.findQuizWithQuestionsById(1)).thenReturn(Optional.of(quiz));

        var response = quizService.calculateResult(1, List.of(secondResponse, firstResponse));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody());
    }
}
