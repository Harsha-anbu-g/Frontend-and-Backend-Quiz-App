package com.example.quizapp.dao;

import com.example.quizapp.model.Quiz;
import com.example.quizapp.model.QuizSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuizDao extends JpaRepository<Quiz,Integer> {

    @Query("SELECT q FROM Quiz q LEFT JOIN FETCH q.questions WHERE q.id = :id")
    Optional<Quiz> findQuizWithQuestionsById(@Param("id") Integer id);

    @Query("""
            SELECT new com.example.quizapp.model.QuizSummary(q.id, q.title, COUNT(question))
            FROM Quiz q
            LEFT JOIN q.questions question
            GROUP BY q.id, q.title
            ORDER BY q.id DESC
            """)
    List<QuizSummary> findQuizSummaries();

    List<Quiz> findAllByQuestions_Id(Integer questionId);
}
