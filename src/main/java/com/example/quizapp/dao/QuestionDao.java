package com.example.quizapp.dao;


import com.example.quizapp.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionDao extends JpaRepository<Question,Integer>  {

    List<Question> findByCategoryIgnoreCase(String category);

    @Query(value = "SELECT * FROM question q ORDER BY RANDOM() LIMIT :numQ", nativeQuery = true)
    List<Question> findRandomQuestions(@Param("numQ") int numQ);

    @Query(value = "SELECT * FROM question q WHERE LOWER(TRIM(q.category)) = LOWER(TRIM(:category)) ORDER BY RANDOM() LIMIT :numQ", nativeQuery = true)
    List<Question> findRandomQuestionsByCategory(@Param("category") String category, @Param("numQ") int numQ);

    @Query(value = """
            SELECT * FROM question q
            WHERE LOWER(TRIM(q.difficulty_level)) = LOWER(TRIM(:difficultyLevel))
            ORDER BY RANDOM()
            LIMIT :numQ
            """, nativeQuery = true)
    List<Question> findRandomQuestionsByDifficulty(
            @Param("difficultyLevel") String difficultyLevel,
            @Param("numQ") int numQ
    );

    @Query(value = """
            SELECT * FROM question q
            WHERE LOWER(TRIM(q.category)) = LOWER(TRIM(:category))
              AND LOWER(TRIM(q.difficulty_level)) = LOWER(TRIM(:difficultyLevel))
            ORDER BY RANDOM()
            LIMIT :numQ
            """, nativeQuery = true)
    List<Question> findRandomQuestionsByCategoryAndDifficulty(
            @Param("category") String category,
            @Param("difficultyLevel") String difficultyLevel,
            @Param("numQ") int numQ
    );

}
