package com.community.productcommunity.repository;

import com.community.productcommunity.model.Question;
import com.community.productcommunity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTitleContainingIgnoreCase(String title);
    List<Question> findByProductCode(String productCode);
    List<Question> findByUserEmail(String email);
    List<Question> findByLabel(String label);
    List<Question> findByDatePostedBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Question> findByUser(User user);

    Long countByStatus(boolean status);

    @Query("SELECT q FROM Question q WHERE " +
            "(:title IS NULL OR LOWER(q.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:productCode IS NULL OR q.productCode = :productCode) AND " +
            "(:email IS NULL OR q.user.email = :email) AND " +
            "(:label IS NULL OR q.label = :label)")
    List<Question> findByMultipleParameters(
            @Param("title") String title,
            @Param("productCode") String productCode,
            @Param("email") String email,
            @Param("label") String label);
}