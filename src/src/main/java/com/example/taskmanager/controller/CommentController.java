package com.example.taskmanager.controller;

import com.example.taskmanager.entity.Comment;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/tasks/{taskId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String taskId) {
        List<Comment> comments = commentService.getComments(taskId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/tasks/{taskId}/comments")
    public ResponseEntity<Comment> createComment(
            @PathVariable String taskId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        String userId = auth.getName();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String content = body.get("content");
        Comment comment = commentService.createComment(taskId, userId, user.getEmail(), content);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id, Authentication auth) {
        String userId = auth.getName();
        commentService.deleteComment(id, userId);
        return ResponseEntity.noContent().build();
    }
}