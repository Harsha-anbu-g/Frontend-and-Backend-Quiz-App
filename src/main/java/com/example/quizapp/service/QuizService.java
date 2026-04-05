package com.example.quizapp.service;

import com.example.quizapp.dao.QuestionDao;
import com.example.quizapp.dao.QuizDao;
import com.example.quizapp.model.Question;
import com.example.quizapp.model.QuizCreateResponse;
import com.example.quizapp.model.QuestionWrapper;
import com.example.quizapp.model.Quiz;
import com.example.quizapp.model.Response;
import com.example.quizapp.model.QuizSummary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class QuizService {

    private final QuizDao quizDao;
    private final QuestionDao questionDao;

    public QuizService(QuizDao quizDao, QuestionDao questionDao) {
        this.quizDao = quizDao;
        this.questionDao = questionDao;
    }

    public ResponseEntity<QuizCreateResponse> createQuiz(String category, int numQ, String title, String difficultyLevel) {
        String normalizedCategory = normalizeFilter(category);
        String normalizedDifficultyLevel = normalizeFilter(difficultyLevel);

        List<Question> questions = selectQuestionsForQuiz(normalizedCategory, normalizedDifficultyLevel, numQ);

        if (questions.isEmpty()) {
            return new ResponseEntity<>(
                    new QuizCreateResponse("No questions found for the selected filters", null, title, 0),
                    HttpStatus.NOT_FOUND
            );
        }

        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setQuestions(questions);
        Quiz savedQuiz = quizDao.save(quiz);

        return new ResponseEntity<>(
                new QuizCreateResponse("Quiz created successfully", savedQuiz.getId(), savedQuiz.getTitle(), questions.size()),
                HttpStatus.CREATED
        );

    }

    private List<Question> selectQuestionsForQuiz(String category, String difficultyLevel, int numQ) {
        if (category == null && difficultyLevel == null) {
            return questionDao.findRandomQuestions(numQ);
        }

        if (category == null) {
            return questionDao.findRandomQuestionsByDifficulty(difficultyLevel, numQ);
        }

        if (difficultyLevel == null) {
            return questionDao.findRandomQuestionsByCategory(category, numQ);
        }

        return questionDao.findRandomQuestionsByCategoryAndDifficulty(category, difficultyLevel, numQ);
    }

    private String normalizeFilter(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim().toLowerCase();
        return normalized.isEmpty() ? null : normalized;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<List<QuizSummary>> getAllQuizzes() {
        return new ResponseEntity<>(quizDao.findQuizSummaries(), HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<String> deleteQuiz(Integer id) {
        Optional<Quiz> quiz = quizDao.findById(id);
        if (quiz.isEmpty()) {
            return new ResponseEntity<>("Quiz not found.", HttpStatus.NOT_FOUND);
        }

        quizDao.delete(quiz.get());
        return new ResponseEntity<>("Quiz deleted successfully.", HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestion(Integer id) {
        Optional<Quiz> quiz = quizDao.findQuizWithQuestionsById(id);
        if (quiz.isEmpty()) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
        }
        List<Question> questionsFromDB = quiz.get().getQuestions();
        List<QuestionWrapper> questionForUser = new ArrayList<>();
        for (Question q : questionsFromDB){
            QuestionWrapper qw = new QuestionWrapper(q.getId(), q.getQuestionTitle(), q.getOption1(), q.getOption2(), q.getOption3(), q.getOption4() );
            questionForUser.add(qw);
        }
        return new ResponseEntity<>(questionForUser, HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Integer> calculateResult(Integer id, List<Response> responses) {
        Optional<Quiz> quizFromDb = quizDao.findQuizWithQuestionsById(id);
        if (quizFromDb.isEmpty()) {
            return new ResponseEntity<>(0, HttpStatus.NOT_FOUND);
        }

        if (responses == null) {
            return new ResponseEntity<>(0, HttpStatus.BAD_REQUEST);
        }

        Quiz quiz = quizFromDb.get();
        List<Question> questions = quiz.getQuestions();
        Map<Integer, String> submittedResponses = new HashMap<>();

        for (Response response : responses) {
            if (response.getId() != null) {
                submittedResponses.put(response.getId(), response.getResponse());
            }
        }

        int right = 0;
        for (Question question : questions) {
            String submittedAnswer = submittedResponses.get(question.getId());
            if (submittedAnswer != null && submittedAnswer.equals(question.getRightAnswer())) {
                right++;
            }
        }
        return new ResponseEntity<>(right, HttpStatus.OK);
    }
}
