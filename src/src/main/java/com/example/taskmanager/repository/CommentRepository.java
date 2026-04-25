package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByTaskIdOrderByCreatedAtDesc(String taskId);
}
