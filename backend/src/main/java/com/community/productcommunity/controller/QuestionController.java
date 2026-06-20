package com.community.productcommunity.controller;

import com.community.productcommunity.dto.QuestionRequest;
import com.community.productcommunity.dto.QuestionResponse;
import com.community.productcommunity.model.Question;
import com.community.productcommunity.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestionById(@PathVariable Long id) {
        Question question = questionService.getQuestionById(id);
        QuestionResponse responseDTO = QuestionResponse.fromEntity(question);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        List<QuestionResponse> responseDTOs = questions.stream()
                .map(QuestionResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDTOs);
    }

    @PostMapping
    public ResponseEntity<QuestionResponse> postQuestion(@Valid @RequestBody QuestionRequest questionRequest) {
        Question savedQuestion = questionService.postQuestion(questionRequest);
        QuestionResponse responseDTO = QuestionResponse.fromEntity(savedQuestion);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<QuestionResponse>> searchQuestions(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String productCode,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String label,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo) {

        List<Question> questions = questionService.searchQuestions(title, productCode, email, label, dateFrom, dateTo);
        List<QuestionResponse> responseDTOs = questions.stream()
                .map(QuestionResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDTOs);
    }

    @PutMapping("/{id}/close")
    public ResponseEntity<QuestionResponse> closeQuestion(@PathVariable Long id) {
        Question closedQuestion = questionService.closeQuestion(id);
        QuestionResponse responseDTO = QuestionResponse.fromEntity(closedQuestion);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/my")
    public ResponseEntity<List<QuestionResponse>> getMyQuestions() {
        List<Question> questions = questionService.getMyQuestions();
        List<QuestionResponse> responseDTOs = questions.stream()
                .map(QuestionResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDTOs);
    }
}
