package org.josh.backend.openai;

import java.util.List;

public record Gpt3TurboRequest(
    String model,
    List<PromptMessage> messages

) {
}
