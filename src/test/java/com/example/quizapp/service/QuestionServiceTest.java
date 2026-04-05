package com.example.quizapp.service;

import com.example.quizapp.dao.QuestionDao;
import com.example.quizapp.dao.QuizDao;
import com.example.quizapp.model.Question;
import com.example.quizapp.model.Quiz;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private QuestionDao questionDao;

    @Mock
    private QuizDao quizDao;

    @InjectMocks
    private QuestionService questionService;

    @Test
    void deleteQuestionReturnsNotFoundWhenQuestionDoesNotExist() {
        when(questionDao.findById(99)).thenReturn(java.util.Optional.empty());

        var response = questionService.deleteQuestion(99);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Question not found", response.getBody());
    }

    @Test
    void deleteQuestionDeletesQuestionWhenItExists() {
        Question question = new Question();
        question.setId(7);
        when(questionDao.findById(7)).thenReturn(java.util.Optional.of(question));
        when(quizDao.findAllByQuestions_Id(7)).thenReturn(List.of());

        var response = questionService.deleteQuestion(7);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Question deleted successfully", response.getBody());
        verify(questionDao).delete(question);
        verify(quizDao, never()).saveAll(any());
    }

    @Test
    void deleteQuestionRemovesQuestionFromSavedQuizzesBeforeDeleting() {
        Question question = new Question();
        question.setId(10);

        Question secondQuestion = new Question();
        secondQuestion.setId(20);

        Quiz quiz = new Quiz();
        quiz.setId(3);
        quiz.setQuestions(new java.util.ArrayList<>(List.of(question, secondQuestion)));

        when(questionDao.findById(10)).thenReturn(java.util.Optional.of(question));
        when(quizDao.findAllByQuestions_Id(10)).thenReturn(List.of(quiz));

        var response = questionService.deleteQuestion(10);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, quiz.getQuestions().size());
        assertEquals(20, quiz.getQuestions().get(0).getId());
        verify(quizDao).saveAll(List.of(quiz));
        verify(questionDao).delete(question);
    }

    @Test
    void getQuestionByCategoryUsesCaseInsensitiveRepositoryLookup() {
        when(questionDao.findByCategoryIgnoreCase("Java")).thenReturn(List.of());

        var response = questionService.getQuestionByCategory("Java");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(questionDao).findByCategoryIgnoreCase("Java");
    }

    @Test
    void addQuestionNormalizesCategoryBeforeSaving() {
        Question question = new Question();
        question.setQuestionTitle("Sample");
        question.setOption1("A");
        question.setOption2("B");
        question.setOption3("C");
        question.setOption4("D");
        question.setRightAnswer("A");
        question.setDifficultyLevel("Easy");
        question.setCategory(" Java ");

        var response = questionService.addQuestion(question);

        ArgumentCaptor<Question> captor = ArgumentCaptor.forClass(Question.class);
        verify(questionDao).save(captor.capture());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("java", captor.getValue().getCategory());
    }
}
