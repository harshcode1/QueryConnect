package com.community.productcommunity.dto;

import com.community.productcommunity.model.Comment;
import com.community.productcommunity.model.Like;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CommentResponse {
    private Long cid;
    private String username; // Add username field
    private LocalDateTime datePosted;
    private String content;
    private List<CommentResponse> replies;
    private Long parentCommentId;
    private List<Like> likes;
    private boolean status;

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    // Constructor to convert Comment entity to DTO
    public static CommentResponse fromEntity(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setCid(comment.getCid());
        dto.setUsername(comment.getUser().getFirstName()+" "+comment.getUser().getLastName()); // Extract username from User
        dto.setDatePosted(comment.getDatePosted());
        dto.setContent(comment.getContent());
        dto.setStatus(comment.getStatus());


        // Handle replies recursively
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            dto.setReplies(comment.getReplies().stream()
                    .map(CommentResponse::fromEntity)
                    .collect(Collectors.toList()));
        } else {
            dto.setReplies(new ArrayList<>());
        }

        // Set parent comment ID if exists
        if (comment.getParentComment() != null) {
            dto.setParentCommentId(comment.getParentComment().getCid());
        }

        // Set likes
        dto.setLikes(comment.getLikes());

        return dto;
    }

    // Convert a list of Comment entities to DTOs
    public static List<CommentResponse> fromEntityList(List<Comment> comments) {
        return comments.stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Getters and Setters
    public Long getCid() {
        return cid;
    }

    public void setCid(Long cid) {
        this.cid = cid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getDatePosted() {
        return datePosted;
    }

    public void setDatePosted(LocalDateTime datePosted) {
        this.datePosted = datePosted;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<CommentResponse> getReplies() {
        return replies;
    }

    public void setReplies(List<CommentResponse> replies) {
        this.replies = replies;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public List<Like> getLikes() {
        return likes;
    }

    public void setLikes(List<Like> likes) {
        this.likes = likes;
    }
}