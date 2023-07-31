package org.josh.backend.openai;

import org.assertj.core.api.Assertions;
import org.josh.backend.workshop.WorkshopFormData;
import org.junit.jupiter.api.Test;

import java.util.List;

class PromptBuilderTest {

    private final PromptBuilder promptBuilder = new PromptBuilder();

    @Test
    void test_buildArticleRequestWithFormData() {
        // given
        WorkshopFormData workshopFormData = new WorkshopFormData(
            "testTopic",
            "testSubTopic",
            List.of("testBuzzWord1", "testBuzzWord2")
        );

        String systemPrompt = """
            As an AI language model with an educator role, you are tasked to create workshops and lessons about specific topics of (%s).
            Your style of teaching should be simplistic and easily comprehensible, targeted at a comprehension level of a 12-year-old.
                       
            Your output is a written piece about the given topic, explaining it in a lucid and straightforward manner.
            The text should be written in Markdown, similar to the GitHub style.
                        
            In instances where you need to generate code blocks, ensure to format them with triple backticks (`) and specify the code language.
            Here's an example:

            ```js
            // code here
            ```
            """.formatted(workshopFormData.language());

        String prompt = """
            Your task is to compose a comprehensive yet straightforward educational article about %s.
            Do take note of the following keywords: [%s]. If no keywords are provided in the aforementioned list, feel free to disregard it
            """.formatted(workshopFormData.topic(),
            workshopFormData.buzzWords().toString());

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
        Gpt3TurboRequest request = promptBuilder.buildRequestWithFormData(workshopFormData);

        // then
        Assertions.assertThat(request)
            .isNotNull()
            .isEqualTo(expectedRequest);
    }

    @Test
    void test_buildChallengeRequestWithPreviousData() {
        // given
        Gpt3TurboResponse previousResponse = new Gpt3TurboResponse(
            "testId",
            "chat.completion",
            42069,
            List.of(new Gpt3TurboResponse.Choices(
                0, new PromptMessage(
                "testPrompt", "testContent"),
                "stop")),
            new Gpt3TurboResponse.Usage(
                69,
                420,
                42069
            ));

        String previousArticle = previousResponse.choices().get(0).message().content();

        String systemPrompt = """
            You are always creating a single challenge for the reader to solve based on the provided article's content.
            The challenge should be achievable, not overly difficult, and take approximately 10 to 30 minutes to complete.
            The text should also be written in Markdown, like GitHub.
                        
            In instances where you need to generate code blocks, ensure to format them with triple backticks (`) and specify the code language.
            Here's an example:

            ```js
            // code here
            ```
            """;

        String prompt = """
            Formulate a small interactive challenge based on the article you wrote previously.
            Make sure that the Challenge is not too difficult and can be solved in 10 to 30 minutes.
                        
            This challenge should be carefully designed so as not to be overly complex, with an estimated completion time between 10 and 30 minutes.
            Furthermore, it should be crafted in a way that allows the reader to solve it directly within a web-based code editor.
                        
            The article you wrote previously and the challenge should be based on is as follows:
            ###
            %s
            ###
            """.formatted(previousArticle);

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
        Gpt3TurboRequest request = promptBuilder.buildChallengeRequestWithPreviousData(previousResponse);

        // then
        Assertions.assertThat(request)
            .isNotNull()
            .isEqualTo(expectedRequest);
    }
}
