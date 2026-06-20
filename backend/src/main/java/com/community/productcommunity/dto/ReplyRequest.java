package com.community.productcommunity.dto;

import jakarta.validation.constraints.NotBlank;

public class ReplyRequest {
    @NotBlank(message = "Content is required")
    private String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
