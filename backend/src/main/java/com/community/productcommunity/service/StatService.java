package com.community.productcommunity.service;

import com.community.productcommunity.dto.StatsResponse;
import com.community.productcommunity.repository.CommentRepository;
import com.community.productcommunity.repository.QuestionRepository;
import com.community.productcommunity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class StatService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CommentRepository commentRepository;

    public StatsResponse  getStats() {
        long totalUsers = userRepository.count();
        long totalQuestions = questionRepository.count();
        long totalClosedQuestions = questionRepository.countByStatus(true);
        long totalComments = commentRepository.count();

        return new StatsResponse(totalUsers, totalQuestions, totalClosedQuestions, totalComments);
    }
}
