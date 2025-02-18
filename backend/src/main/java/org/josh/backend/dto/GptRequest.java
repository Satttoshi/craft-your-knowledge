package org.josh.backend.dto;

import org.josh.backend.openai.PromptMessage;

import java.util.List;

public record GptRequest(
        String model,
        List<PromptMessage> messages,
        double temperature
) {
}
