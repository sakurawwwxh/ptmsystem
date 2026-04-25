package com.example.taskmanager.service;

import com.example.taskmanager.entity.Subtask;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class TaskDecomposeService {

    private static final int MAX_SUBTASK_TITLE_LENGTH = 50;

    public List<Subtask> decompose(String title, String description) {
        String text = title;
        if (description != null && !description.isBlank()) {
            text = text + "。" + description;
        }

        List<String> parts = splitByRules(text);

        return parts.stream()
            .map(part -> {
                Subtask st = new Subtask();
                st.setId(UUID.randomUUID().toString());
                st.setTitle(trimToLength(part, MAX_SUBTASK_TITLE_LENGTH));
                st.setCompleted(false);
                return st;
            })
            .collect(Collectors.toList());
    }

    private List<String> splitByRules(String text) {
        List<String> result = new ArrayList<>();

        text = text.trim();

        String[] separators = {
            "首先", "然后", "最后",
            "第一", "第二", "第三", "第四", "第五",
            "第一步", "第二步", "第三步", "第四步", "第五步",
            "1.", "2.", "3.", "4.", "5.",
            "一、", "二、", "三、", "四、", "五、",
            "（1）", "（2）", "（3）", "（4）", "（5）",
            "①", "②", "③", "④", "⑤",
            "first", "then", "finally",
            "step 1", "step 2", "step 3", "step 4", "step 5",
            "next", "after that"
        };

        for (String sep : separators) {
            if (text.contains(sep)) {
                String[] parts = text.split(Pattern.quote(sep));
                for (String part : parts) {
                    String trimmed = part.trim();
                    if (!trimmed.isEmpty() && trimmed.length() > 2) {
                        result.add(trimmed);
                    }
                }
                if (result.size() > 1) {
                    return result;
                }
                result.clear();
            }
        }

        String[] sentenceSeparators = {"。", "！", "？"};
        for (String sep : sentenceSeparators) {
            if (text.contains(sep)) {
                String[] parts = text.split("[" + sep + "]");
                for (String part : parts) {
                    String trimmed = part.trim();
                    if (!trimmed.isEmpty() && trimmed.length() > 2) {
                        result.add(trimmed);
                    }
                }
                if (result.size() > 1) {
                    return result;
                }
                result.clear();
                break;
            }
        }

        String[] lineSeparators = {"\n", "\r\n", "\n\r"};
        for (String sep : lineSeparators) {
            if (text.contains(sep)) {
                String[] parts = text.split(sep);
                for (String part : parts) {
                    String trimmed = part.trim();
                    if (!trimmed.isEmpty() && trimmed.length() > 2) {
                        result.add(trimmed);
                    }
                }
                if (result.size() > 1) {
                    return result;
                }
                result.clear();
                break;
            }
        }

        if (result.isEmpty() && text.length() > 10) {
            int mid = text.length() / 2;
            int cut = findCutPoint(text, mid);
            String part1 = text.substring(0, cut).trim();
            String part2 = text.substring(cut).trim();
            if (!part1.isEmpty()) result.add(part1);
            if (!part2.isEmpty()) result.add(part2);
        }

        if (result.isEmpty()) {
            result.add(text);
        }

        return result;
    }

    private int findCutPoint(String text, int center) {
        String markers = "，、,;；";
        int bestCut = center;

        for (int i = center - 5; i <= center + 5 && i >= 0 && i < text.length(); i++) {
            char c = text.charAt(i);
            if (markers.indexOf(c) >= 0) {
                bestCut = i + 1;
                break;
            }
        }

        return bestCut;
    }

    private String trimToLength(String text, int maxLength) {
        if (text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - 3) + "...";
    }
}
