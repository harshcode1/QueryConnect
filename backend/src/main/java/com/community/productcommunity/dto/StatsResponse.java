package com.community.productcommunity.dto;

public class StatsResponse {
    private long totalUsers;
    private long totalQuestions;
    private long totalClosedQuestions;
    private long totalComments;

    // No-args constructor
    public StatsResponse() {
    }

    // All-args constructor
    public StatsResponse(long totalUsers, long totalQuestions, long totalClosedQuestions, long totalComments) {
        this.totalUsers = totalUsers;
        this.totalQuestions = totalQuestions;
        this.totalClosedQuestions = totalClosedQuestions;
        this.totalComments = totalComments;
    }

    // Getters and Setters

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(long totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public long getTotalClosedQuestions() {
        return totalClosedQuestions;
    }

    public void setTotalClosedQuestions(long totalClosedQuestions) {
        this.totalClosedQuestions = totalClosedQuestions;
    }

    public long getTotalComments() {
        return totalComments;
    }

    public void setTotalComments(long totalComments) {
        this.totalComments = totalComments;
    }

    @Override
    public String toString() {
        return "StatsResponse{" +
                "totalUsers=" + totalUsers +
                ", totalQuestions=" + totalQuestions +
                ", totalClosedQuestions=" + totalClosedQuestions +
                ", totalComments=" + totalComments +
                '}';
    }
}
