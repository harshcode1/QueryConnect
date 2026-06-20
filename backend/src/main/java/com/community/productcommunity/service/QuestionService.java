package com.community.productcommunity.service;

import com.community.productcommunity.dto.QuestionRequest;
import com.community.productcommunity.model.Question;
import com.community.productcommunity.model.User;
import com.community.productcommunity.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserService userService;

    public Question postQuestion(QuestionRequest questionRequest) {
        User currentUser = getCurrentUser();

        Question question = new Question();
        question.setUser(currentUser);
        question.setDatePosted(LocalDateTime.now());
        question.setContent(questionRequest.getContent());
        question.setTitle(questionRequest.getTitle());
        question.setLabel(questionRequest.getLabel());
        question.setProductCode(questionRequest.getProductCode());
        question.setStatus(false); // Initially, question is open (not closed)

        return questionRepository.save(question);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public List<Question> searchQuestions(String title, String productCode, String email, String label,
                                          LocalDateTime dateFrom, LocalDateTime dateTo) {
        // If no parameters provided, return all questions
        if (isAllParametersEmpty(title, productCode, email, label) && dateFrom == null && dateTo == null) {
            return questionRepository.findAll();
        }

        List<Question> result = questionRepository.findAll();

        // Filter by each parameter if provided
        if (title != null && !title.isEmpty()) {
            result = result.stream()
                    .filter(q -> q.getTitle().toLowerCase().contains(title.toLowerCase()) ||
                            q.getContent().toLowerCase().contains(title.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (productCode != null && !productCode.isEmpty()) {
            result = result.stream()
                    .filter(q -> q.getProductCode() != null && q.getProductCode().equalsIgnoreCase(productCode))
                    .collect(Collectors.toList());
        }

        if (email != null && !email.isEmpty()) {
            result = result.stream()
                    .filter(q -> q.getUser().getEmail().equalsIgnoreCase(email))
                    .collect(Collectors.toList());
        }

        if (label != null && !label.isEmpty()) {
            result = result.stream()
                    .filter(q -> q.getLabel() != null &&
                            (q.getLabel().equalsIgnoreCase(label) ||
                                    q.getLabel().toLowerCase().contains(label.toLowerCase())))
                    .collect(Collectors.toList());
        }

        // Filter by date range if provided
        if (dateFrom != null) {
            result = result.stream()
                    .filter(q -> q.getDatePosted().isAfter(dateFrom) || q.getDatePosted().isEqual(dateFrom))
                    .collect(Collectors.toList());
        }

        if (dateTo != null) {
            result = result.stream()
                    .filter(q -> q.getDatePosted().isBefore(dateTo) || q.getDatePosted().isEqual(dateTo))
                    .collect(Collectors.toList());
        }

        return result;
    }

    // Overloaded method for backward compatibility
    public List<Question> searchQuestions(String title, String productCode, String email, String label) {
        return searchQuestions(title, productCode, email, label, null, null);
    }

    private boolean isAllParametersEmpty(String title, String productCode, String email, String label) {
        return (title == null || title.isEmpty()) &&
                (productCode == null || productCode.isEmpty()) &&
                (email == null || email.isEmpty()) &&
                (label == null || label.isEmpty());
    }

    public Question closeQuestion(Long questionId) {
        Question question = getQuestionById(questionId);
        User currentUser = getCurrentUser();
        if (!question.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You can only close your own questions");
        }
        question.setStatus(true);
        return questionRepository.save(question);
    }

    public Question getQuestionById(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id: " + questionId));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.getUserByEmail(authentication.getName());
    }

    public List<Question> getMyQuestions() {
        User user = getCurrentUser();
        return questionRepository.findByUser(user);
    }
}