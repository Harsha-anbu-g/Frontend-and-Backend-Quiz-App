package com.example.quizapp.service;

import com.example.quizapp.model.Question;
import com.example.quizapp.dao.QuestionDao;
import com.example.quizapp.dao.QuizDao;
import com.example.quizapp.model.Quiz;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
        try {
            return new ResponseEntity<>(questionDao.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<List<Question>> getQuestionByCategory(String category) {
        try {
            return new ResponseEntity<>(questionDao.findByCategoryIgnoreCase(category), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> addQuestion(Question question) {
        try {
            normalizeQuestion(question);
            questionDao.save(question);
            return new ResponseEntity<>("Question added successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failed to add Question", HttpStatus.BAD_REQUEST);

    }

    @Transactional
    public ResponseEntity<String> deleteQuestion(Integer id) {
        try {
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
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failed to delete Question", HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> updateQuestion(Integer id, Question question) {
        try {
            Question existingQuestion = questionDao.findById(id).orElse(null);
            if (existingQuestion == null) {
                return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
            }
            question.setId(id);
            normalizeQuestion(question);
            questionDao.save(question);
            return new ResponseEntity<>("Question updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failed to update Question", HttpStatus.BAD_REQUEST);
    }

    private void normalizeQuestion(Question question) {
        if (question.getCategory() != null) {
            question.setCategory(question.getCategory().trim().toLowerCase());
        }
    }
}
