package com.community.productcommunity.controller;

import com.community.productcommunity.dto.CommentRequest;
import com.community.productcommunity.dto.CommentResponse;
import com.community.productcommunity.dto.ReplyRequest;
import com.community.productcommunity.model.Comment;
import com.community.productcommunity.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/{questionId}")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long questionId) {
        List<Comment> comments = commentService.getComments(questionId);
        List<CommentResponse> responseDTOs = CommentResponse.fromEntityList(comments);
        return ResponseEntity.ok(responseDTOs);
    }

    @PostMapping
    public ResponseEntity<CommentResponse> postComment(@Valid @RequestBody CommentRequest commentRequest) {
        Comment savedComment = commentService.postComment(commentRequest);
        CommentResponse responseDTO = CommentResponse.fromEntity(savedComment);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PostMapping("/reply/{parentCommentId}")
    public ResponseEntity<CommentResponse> replyToComment(
            @PathVariable Long parentCommentId,
            @Valid @RequestBody ReplyRequest replyRequest) {
        Comment savedReply = commentService.replyToComment(parentCommentId, replyRequest);
        CommentResponse responseDTO = CommentResponse.fromEntity(savedReply);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{commentId}/approve")
    public ResponseEntity<CommentResponse> approveComment(@PathVariable Long commentId) {
        Comment approvedComment = commentService.approveComment(commentId);
        CommentResponse responseDTO = CommentResponse.fromEntity(approvedComment);
        return ResponseEntity.ok(responseDTO);
    }
}
