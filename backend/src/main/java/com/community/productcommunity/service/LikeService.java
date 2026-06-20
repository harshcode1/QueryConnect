package com.community.productcommunity.service;

import com.community.productcommunity.model.Comment;
import com.community.productcommunity.model.Like;
import com.community.productcommunity.model.User;
import com.community.productcommunity.repository.CommentRepository;
import com.community.productcommunity.repository.LikeRepository;
import com.community.productcommunity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Toggle like on a comment - if already liked, unlike it; if not liked, like it
     * @param commentId ID of the comment to toggle like status
     * @return true if comment is now liked, false if unliked
     */
    @Transactional
    public boolean toggleLike(Long commentId) {
        User currentUser = getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found with id: " + commentId));

        // Check if user already liked this comment
        return likeRepository.findByUserAndComment(currentUser, comment)
                .map(like -> {
                    // User already liked this comment, so unlike it
                    likeRepository.delete(like);
                    return false; // Return false to indicate comment is now unliked
                })
                .orElseGet(() -> {
                    // User hasn't liked this comment yet, so like it
                    Like newLike = new Like();
                    newLike.setUser(currentUser);
                    newLike.setComment(comment);
                    likeRepository.save(newLike);
                    return true; // Return true to indicate comment is now liked
                });
    }

    /**
     * Get like count for a specific comment
     * @param commentId ID of the comment
     * @return number of likes
     */
    public long getLikeCount(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found with id: " + commentId));
        return likeRepository.countByComment(comment);
    }

    /**
     * Get like counts for multiple comments
     * @param commentIds List of comment IDs
     * @return Map of comment ID to like count
     */
    public Map<Long, Long> getLikeCounts(List<Long> commentIds) {
        List<Object[]> results = likeRepository.countLikesByCommentIds(commentIds);

        return results.stream()
                .collect(Collectors.toMap(
                        result -> (Long) result[0],  // comment ID
                        result -> (Long) result[1]   // like count
                ));
    }

    /**
     * Check if current user has liked a specific comment
     * @param commentId ID of the comment
     * @return true if user has liked the comment, false otherwise
     */
    public boolean hasUserLikedComment(Long commentId) {
        try {
            User currentUser = getCurrentUser();
            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new NoSuchElementException("Comment not found with id: " + commentId));

            return likeRepository.findByUserAndComment(currentUser, comment).isPresent();
        } catch (Exception e) {
            // If there's any error (like user not authenticated), return false
            return false;
        }
    }

    /**
     * Get all likes for a comment
     * @param commentId ID of the comment
     * @return List of likes
     */
    public List<Like> getLikesByComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found with id: " + commentId));
        return likeRepository.findByComment(comment);
    }

    /**
     * Get all likes by a user
     * @param userId ID of the user
     * @return List of likes
     */
    public List<Like> getLikesByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        return likeRepository.findByUser(user);
    }

    /**
     * Get the currently authenticated user
     * @return User entity
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.getUserByEmail(authentication.getName());
    }
}