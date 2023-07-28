package org.josh.backend.openai;

import org.assertj.core.api.Assertions;
import org.josh.backend.utils.Difficulty;
import org.josh.backend.workshop.WorkshopFormData;
import org.junit.jupiter.api.Test;

import java.util.List;

class OpenAiServiceTest {

    private OpenAiService openAiService = new OpenAiService();

    @Test
    void test_buildRequestWithFormData() {
        // given
        WorkshopFormData testWorkshopFormData = new WorkshopFormData(
            "testTopic",
            "testSubTopic",
            List.of("testBuzzWord1", "testBuzzWord2"),
            0,
            Difficulty.EASY
        );

        String systemPrompt = "You are a helpful assistant teaching about %s".formatted(testWorkshopFormData.topic());

        String prompt = """
            Write an article about %s.
            The article should be easy to understand.
            The difficulty level should be %s.
            Difficulty means how hard it is to understand. usually from junior to senior.
            The estimated time to master should be %d minutes.
            Please Consider the following buzz words:[ %s ], if no buzz words are provided in previous array, please ignore this.
            Add a little challenge to the end and consider the estimated time to master and difficulty level to determine the challenge.
            """.formatted(testWorkshopFormData.subTopic(),
            testWorkshopFormData.difficulty().toString(), testWorkshopFormData.estimatedTimeToMaster(),
            testWorkshopFormData.buzzWords().toString());

        Gpt3TurboRequest expectedRequest = new Gpt3TurboRequest(
            "gpt-3.5-turbo",
            List.of(
                new PromptMessage(
                    "system",
                    systemPrompt
                ),
                new PromptMessage(
                    "user",
                    prompt
                )
            )
        );

        // when
        Gpt3TurboRequest request = openAiService.buildRequestWithFormData(testWorkshopFormData);

        // then
        Assertions.assertThat(request).isNotNull().isEqualTo(expectedRequest);
    }
}
