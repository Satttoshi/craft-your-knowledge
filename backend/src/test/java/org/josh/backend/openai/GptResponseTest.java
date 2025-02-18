package org.josh.backend.openai;

import org.josh.backend.dto.GptResponse;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

class GptResponseTest {

    @Test
    void testRecordClass() {
        // given
        String id = "test_id";
        String object = "test_object";
        int created = 12345;
        String model = "gpt-4o-mini";

        PromptMessage message = new PromptMessage("assistant", "testcontent");
        List<GptResponse.Choices> choices = List.of(
                new GptResponse.Choices(
                        message,
                        null, // logprobs
                        "stop", // finish_reason
                        0 // index
                )
        );

        GptResponse.Usage.CompletionTokensDetails tokenDetails =
                new GptResponse.Usage.CompletionTokensDetails(
                        0, // reasoning_tokens
                        0, // accepted_prediction_tokens
                        0  // rejected_prediction_tokens
                );

        GptResponse.Usage usage = new GptResponse.Usage(
                10, // prompt_tokens
                20, // completion_tokens
                30, // total_tokens
                tokenDetails
        );

        // when
        GptResponse response = new GptResponse(id, object, created, model, choices, usage);

        // then
        assertEquals(id, response.id());
        assertEquals(object, response.object());
        assertEquals(created, response.created());
        assertEquals(model, response.model());
        assertEquals(choices, response.choices());
        assertEquals(usage, response.usage());

        // Verify nested objects
        GptResponse.Choices firstChoice = response.choices().get(0);
        assertEquals(message, firstChoice.message());
        assertEquals("stop", firstChoice.finish_reason());
        assertEquals(0, firstChoice.index());

        // Verify usage details
        assertEquals(10, response.usage().prompt_tokens());
        assertEquals(20, response.usage().completion_tokens());
        assertEquals(30, response.usage().total_tokens());

        // Verify completion tokens details
        GptResponse.Usage.CompletionTokensDetails completionDetails =
                response.usage().completion_tokens_details();
        assertNotNull(completionDetails);
        assertEquals(0, completionDetails.reasoning_tokens());
        assertEquals(0, completionDetails.accepted_prediction_tokens());
        assertEquals(0, completionDetails.rejected_prediction_tokens());
    }
}
