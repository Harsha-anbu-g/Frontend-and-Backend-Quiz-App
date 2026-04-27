package com.example.quizapp.service;

import com.example.quizapp.model.Question;
import com.example.quizapp.dao.QuestionDao;
import com.example.quizapp.dao.QuizDao;
import com.example.quizapp.model.Quiz;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionDao questionDao;
    private final QuizDao quizDao;

    public QuestionService(QuestionDao questionDao, QuizDao quizDao) {
        this.questionDao = questionDao;
        this.quizDao = quizDao;
    }

    public ResponseEntity<List<Question>> getAllQuestions() {
        return new ResponseEntity<>(questionDao.findAll(), HttpStatus.OK);
    }

    public ResponseEntity<List<Question>> getQuestionByCategory(String category) {
        return new ResponseEntity<>(questionDao.findByCategoryIgnoreCase(category), HttpStatus.OK);
    }

    public ResponseEntity<String> addQuestion(Question question) {
        normalizeQuestion(question);
        questionDao.save(question);
        return new ResponseEntity<>("Question added successfully", HttpStatus.CREATED);
    }

    @Transactional
    public ResponseEntity<String> deleteQuestion(Integer id) {
        Question question = questionDao.findById(id).orElse(null);
        if (question == null) {
            return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
        }

        List<Quiz> quizzesUsingQuestion = quizDao.findAllByQuestions_Id(id);
        for (Quiz quiz : quizzesUsingQuestion) {
            quiz.getQuestions().removeIf(savedQuestion -> savedQuestion.getId().equals(id));
        }

        if (!quizzesUsingQuestion.isEmpty()) {
            quizDao.saveAll(quizzesUsingQuestion);
        }

        questionDao.delete(question);
        return new ResponseEntity<>("Question deleted successfully", HttpStatus.OK);
    }

    public ResponseEntity<String> updateQuestion(Integer id, Question question) {
        Question existingQuestion = questionDao.findById(id).orElse(null);
        if (existingQuestion == null) {
            return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
        }
        question.setId(id);
        normalizeQuestion(question);
        questionDao.save(question);
        return new ResponseEntity<>("Question updated successfully", HttpStatus.OK);
    }

    private void normalizeQuestion(Question question) {
        if (question.getCategory() != null) {
            question.setCategory(question.getCategory().trim().toLowerCase());
        }
    }
}
