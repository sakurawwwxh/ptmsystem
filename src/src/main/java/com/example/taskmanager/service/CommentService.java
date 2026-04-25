package com.example.taskmanager.service;

import com.example.taskmanager.entity.Comment;
import com.example.taskmanager.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getComments(String taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
    }

    @Transactional
    public Comment createComment(String taskId, String userId, String userEmail, String content) {
        Comment comment = new Comment();
        comment.setId(UUID.randomUUID().toString());
        comment.setTaskId(taskId);
        comment.setUserId(userId);
        comment.setUserEmail(userEmail);
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }
        commentRepository.delete(comment);
    }
}