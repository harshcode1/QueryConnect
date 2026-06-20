package com.community.productcommunity.controller;

import com.community.productcommunity.model.Like;
import com.community.productcommunity.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    /**
     * Toggle like status for a comment
     * @param commentId ID of the comment
     * @return Response with like status and count
     */
    @PostMapping("/toggle/{commentId}")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long commentId) {
        boolean isLiked = likeService.toggleLike(commentId);
        long likeCount = likeService.getLikeCount(commentId);

        Map<String, Object> response = new HashMap<>();
        response.put("liked", isLiked);
        response.put("likeCount", likeCount);

        return ResponseEntity.ok(response);
    }

    /**
     * Get like count for a comment
     * @param commentId ID of the comment
     * @return Response with like count
     */
    @GetMapping("/count/{commentId}")
    public ResponseEntity<Map<String, Long>> getLikeCount(@PathVariable Long commentId) {
        long count = likeService.getLikeCount(commentId);

        Map<String, Long> response = new HashMap<>();
        response.put("likeCount", count);

        return ResponseEntity.ok(response);
    }

    /**
     * Get like counts for multiple comments
     * @param commentIds List of comment IDs
     * @return Map of comment ID to like count
     */
    @PostMapping("/counts")
    public ResponseEntity<Map<Long, Long>> getLikeCounts(@RequestBody List<Long> commentIds) {
        Map<Long, Long> counts = likeService.getLikeCounts(commentIds);
        return ResponseEntity.ok(counts);
    }

    /**
     * Check if current user has liked a specific comment
     * @param commentId ID of the comment
     * @return Response with liked status
     */
    @GetMapping("/status/{commentId}")
    public ResponseEntity<Map<String, Boolean>> hasUserLikedComment(@PathVariable Long commentId) {
        boolean hasLiked = likeService.hasUserLikedComment(commentId);

        Map<String, Boolean> response = new HashMap<>();
        response.put("liked", hasLiked);

        return ResponseEntity.ok(response);
    }

    /**
     * Get all likes for a comment
     * @param commentId ID of the comment
     * @return List of likes
     */
    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<Like>> getLikesByComment(@PathVariable Long commentId) {
        List<Like> likes = likeService.getLikesByComment(commentId);
        return ResponseEntity.ok(likes);
    }

    /**
     * Get all likes by a user
     * @param userId ID of the user
     * @return List of likes
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Like>> getLikesByUser(@PathVariable Long userId) {
        List<Like> likes = likeService.getLikesByUser(userId);
        return ResponseEntity.ok(likes);
    }
}