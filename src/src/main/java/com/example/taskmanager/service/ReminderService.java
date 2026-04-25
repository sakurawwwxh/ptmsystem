package com.example.taskmanager.service;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ReminderService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    // Run every minute
    @Scheduled(cron = "0 * * * * *")
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();

        // Find tasks with reminderTime <= now (and reminderTime is set)
        var dueTasks = taskRepository.findByReminderTimeBefore(now);

        for (Task task : dueTasks) {
            userRepository.findById(task.getUserId()).ifPresent(user -> {
                String email = user.getEmail();

                String subject = "任务提醒：" + task.getTitle();
                String body = String.format(
                    "您好，\n\n" +
                    "您的任务「%s」提醒时间已到，请及时处理。\n\n" +
                    "任务详情：\n" +
                    "  标题：%s\n" +
                    "  提醒时间：%s\n" +
                    "  描述：%s\n\n" +
                    "— 任务管理系统",
                    task.getTitle(),
                    task.getTitle(),
                    task.getReminderTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
                    task.getDescription() != null ? task.getDescription() : "无"
                );

                emailService.sendEmail(email, subject, body);
            });

            // Clear reminderTime after sending
            task.setReminderTime(null);
            taskRepository.save(task);
        }

        if (!dueTasks.isEmpty()) {
            System.out.println("ReminderService: Sent " + dueTasks.size() + " reminder(s)");
        }

        // Delete overdue tasks (dueDate passed and not completed)
        var overdueTasks = taskRepository.findByDueDateBefore(LocalDateTime.now());
        for (Task task : overdueTasks) {
            if (task.getStatus() != com.example.taskmanager.entity.TaskStatus.COMPLETED) {
                taskRepository.delete(task);
                System.out.println("ReminderService: Deleted overdue task: " + task.getTitle());
            }
        }
    }
}
