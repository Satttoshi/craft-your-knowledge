package org.josh.backend.dto;

import org.josh.backend.openai.PromptMessage;

import java.util.List;

public record GptResponse(
        String id,
        String object,
        int created,
        String model,
        List<Choices> choices,
        Usage usage
) {
    public record Choices(
            PromptMessage message,
            String logprobs,
            String finish_reason,
            int index
    ) {
    }

    public record Usage(
            int prompt_tokens,
            int completion_tokens,
            int total_tokens,
            CompletionTokensDetails completion_tokens_details
    ) {
        public record CompletionTokensDetails(
                int reasoning_tokens,
                int accepted_prediction_tokens,
                int rejected_prediction_tokens
        ) {
        }
    }
}
