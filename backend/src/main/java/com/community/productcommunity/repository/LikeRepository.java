package com.community.productcommunity.repository;

import com.community.productcommunity.model.Comment;
import com.community.productcommunity.model.Like;
import com.community.productcommunity.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    // Find all likes for a specific comment
    List<Like> findByComment(Comment comment);

    // Find all likes by a specific user
    List<Like> findByUser(User user);

    // Find like by user and comment (to check if a user has already liked a comment)
    Optional<Like> findByUserAndComment(User user, Comment comment);

    // Count likes for a comment
    long countByComment(Comment comment);

    // Count likes for multiple comments (useful for bulk operations)
    @Query("SELECT l.comment.cid, COUNT(l) FROM Like l WHERE l.comment.cid IN :commentIds GROUP BY l.comment.cid")
    List<Object[]> countLikesByCommentIds(@Param("commentIds") List<Long> commentIds);

}
