package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Template;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TemplateRepository extends MongoRepository<Template, String> {
    List<Template> findByUserId(String userId);
}
