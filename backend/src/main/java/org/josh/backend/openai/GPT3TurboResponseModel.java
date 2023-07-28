package org.josh.backend.openai;

import java.util.List;

public record GPT3TurboResponseModel(
    String id,
    String object,
    int created,
    List<Choices> choices,
    Usage usage
) {

    public record Choices(
        int index,
        PromptMessage message,
        String finish_reason
    ) {
    }

    public record Usage(
        int prompt_tokens,
        int completion_tokens,
        int total_tokens
    ) {
    }
}
