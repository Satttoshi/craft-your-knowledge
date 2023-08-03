package org.josh.backend.openai;

import org.josh.backend.dto.Gpt3TurboResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

class Gpt3TurboResponseTest {

    @Test
    void testRecordClass() {
        // given
        String id = "test_id";
        String object = "test_object";
        int created = 12345;
        List<Gpt3TurboResponse.Choices> choices = List.of(
            new Gpt3TurboResponse.Choices(0, new PromptMessage("user", "testcontent"), "test_finish_reason")
        );
        Gpt3TurboResponse.Usage usage = new Gpt3TurboResponse.Usage(10, 20, 30);

        // when
        Gpt3TurboResponse response = new Gpt3TurboResponse(id, object, created, choices, usage);

        // then
        Assertions.assertEquals(id, response.id());
        Assertions.assertEquals(object, response.object());
        Assertions.assertEquals(created, response.created());
        Assertions.assertEquals(choices, response.choices());
        Assertions.assertEquals(usage, response.usage());
    }
}
