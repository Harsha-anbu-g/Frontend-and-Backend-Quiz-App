package com.example.quizapp.controller;

import com.example.quizapp.model.QuestionWrapper;
import com.example.quizapp.model.QuizCreateResponse;
import com.example.quizapp.model.QuizSummary;
import com.example.quizapp.model.Response;
import com.example.quizapp.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("create")
    public ResponseEntity<QuizCreateResponse> createQuiz(
            @RequestParam(required = false) String category,
            @RequestParam int numQ,
            @RequestParam String title,
            @RequestParam(required = false) String difficultyLevel
    ){
        return quizService.createQuiz(category, numQ, title, difficultyLevel);
    }

    @GetMapping("all")
    public ResponseEntity<List<QuizSummary>> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Integer id) {
        return quizService.deleteQuiz(id);
    }

    @GetMapping("get/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestion(@PathVariable Integer id){
        return quizService.getQuizQuestion(id);

    }

    @PostMapping("submit/{id}")
    public ResponseEntity<Integer> submitQuiz(@PathVariable Integer id, @Valid @RequestBody List<Response> responses){

        return quizService.calculateResult(id, responses);

    }

}
