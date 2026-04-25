package com.example.taskmanager.controller;

import com.example.taskmanager.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/sendmail")
    public String sendMail(@RequestParam String to) {
        emailService.sendEmail(to, "测试邮件", "这是一封测试邮件，来自任务管理系统。\n\n—— Claude");
        return "Sent to " + to;
    }
}
