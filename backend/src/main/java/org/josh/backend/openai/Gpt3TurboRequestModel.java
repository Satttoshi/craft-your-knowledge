package org.josh.backend.openai;

import java.util.List;

public record Gpt3TurboRequestModel(
    String model,
    List<PromptMessage> messages

) {
}
