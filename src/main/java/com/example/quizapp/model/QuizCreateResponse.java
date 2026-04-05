package com.example.quizapp.model;

public class QuizCreateResponse {

    private final String message;
    private final Integer quizId;
    private final String title;
    private final int questionCount;

    public QuizCreateResponse(String message, Integer quizId, String title, int questionCount) {
        this.message = message;
        this.quizId = quizId;
        this.title = title;
        this.questionCount = questionCount;
    }

    public String getMessage() {
        return message;
    }

    public Integer getQuizId() {
        return quizId;
    }

    public String getTitle() {
        return title;
    }

    public int getQuestionCount() {
        return questionCount;
    }
}
