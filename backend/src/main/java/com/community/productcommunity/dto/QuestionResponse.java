package com.community.productcommunity.dto;

import com.community.productcommunity.model.Question;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class QuestionResponse {
    private Long qid;
    private String username;
    private LocalDateTime datePosted;
    private String title;
    private String content;
    private Boolean status;
    private String label;
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private String productCode;
    private List<CommentResponse> comments; // Changed to CommentResponse

    // Constructor to convert Question entity to DTO
    public static QuestionResponse fromEntity(Question question) {
        QuestionResponse dto = new QuestionResponse();
        dto.setQid(question.getQid());
        dto.setUsername(question.getUser().getFirstName()+" "+question.getUser().getLastName());
        dto.setDatePosted(question.getDatePosted());
        dto.setTitle(question.getTitle());
        dto.setContent(question.getContent());
        dto.setStatus(question.getStatus());
        dto.setLabel(question.getLabel());
        dto.setProductCode(question.getProductCode());
        dto.setEmail(question.getUser().getEmail());

        // Convert comments to DTOs too if they exist
        if (question.getComments() != null && !question.getComments().isEmpty()) {
            dto.setComments(question.getComments().stream()
                    .map(CommentResponse::fromEntity)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    // Getters and Setters
    public Long getQid() {
        return qid;
    }

    public void setQid(Long qid) {
        this.qid = qid;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public List<CommentResponse> getComments() {
        return comments;
    }

    public void setComments(List<CommentResponse> comments) {
        this.comments = comments;
    }
}