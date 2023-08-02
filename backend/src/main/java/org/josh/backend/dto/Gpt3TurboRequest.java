package org.josh.backend.dto;

import org.josh.backend.openai.PromptMessage;

import java.util.List;

public record Gpt3TurboRequest(
    String model,
    List<PromptMessage> messages

) {
}
