package com.community.productcommunity.repository;

import com.community.productcommunity.model.Comment;
import com.community.productcommunity.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByQuestion(Question question);
}
