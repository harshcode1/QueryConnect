package com.community.productcommunity.service;

import com.community.productcommunity.dto.CommentRequest;
import com.community.productcommunity.dto.ReplyRequest;
import com.community.productcommunity.model.Comment;
import com.community.productcommunity.model.Question;
import com.community.productcommunity.model.User;
import com.community.productcommunity.repository.CommentRepository;
import com.community.productcommunity.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserService userService;

    public Comment postComment(CommentRequest commentRequest) {
        User user = getCurrentUser();

        // Get the actual Question, not Optional
        Question question = questionRepository.findById(commentRequest.getQuestionId())
                .orElseThrow(() -> new NoSuchElementException("Question not found with id: " + commentRequest.getQuestionId()));

        // Create and populate the Comment entity
        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setUser(user); // set managed user
        comment.setDatePosted(LocalDateTime.now());
        comment.setQuestion(question); // set question

        return commentRepository.save(comment);
    }



    public Comment replyToComment(Long parentCommentId, ReplyRequest replyRequest) {
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new NoSuchElementException("Parent comment not found with id: " + parentCommentId));

        Comment reply = new Comment();
        reply.setContent(replyRequest.getContent());
        reply.setParentComment(parentComment);
        reply.setQuestion(parentComment.getQuestion());
        reply.setUser(getCurrentUser());
        reply.setDatePosted(LocalDateTime.now());

        return commentRepository.save(reply);
    }

    private User getCurrentUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.getUserByEmail(authentication.getName());
    }

    public Comment approveComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found with id: " + commentId));

        // Only the question owner can approve comments on their question
        User currentUser = getCurrentUser();
        if (!comment.getQuestion().getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("Only the question owner can approve comments");
        }

        comment.setStatus(true);
        return commentRepository.save(comment);
    }

    public List<Comment> getComments(Long questionId) {



        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id: " + questionId));


        return commentRepository.findByQuestion(question);
    }
}
