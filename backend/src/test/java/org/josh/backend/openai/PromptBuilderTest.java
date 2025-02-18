package org.josh.backend.openai;

import org.assertj.core.api.Assertions;
import org.josh.backend.dto.GptRequest;
import org.josh.backend.dto.GptResponse;
import org.josh.backend.dto.WorkshopFormData;
import org.josh.backend.dto.WorkshopUserChallenge;
import org.josh.backend.security.MongoUserWithoutPassword;
import org.junit.jupiter.api.Test;

import java.util.List;

class PromptBuilderTest {

    private final PromptBuilder promptBuilder = new PromptBuilder();
    private static final double DEFAULT_TEMPERATURE = 0.7;
    private static final String DEFAULT_MODEL = "gpt-4o-mini";

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
                        
            Please refrain from generating image links and svg.
            """.formatted(workshopFormData.language());

        String prompt = """
            Your task is to compose a comprehensive yet straightforward educational article about %s.
            Do take note of the following keywords/buzzwords: [%s]. If no keywords are provided in the aforementioned list, feel free to disregard it.
            If keywords or buzzwords are provided, you should try to include them in your article.
            """.formatted(workshopFormData.topic(),
                workshopFormData.buzzWords().toString());

        GptRequest expectedRequest = new GptRequest(
                DEFAULT_MODEL,
                List.of(
                        new PromptMessage(
                                "system",
                                systemPrompt
                        ),
                        new PromptMessage(
                                "user",
                                prompt
                        )
                ),
                DEFAULT_TEMPERATURE
        );

        // when
        GptRequest request = promptBuilder.buildRequestWithFormData(workshopFormData);

        // then
        Assertions.assertThat(request)
                .isNotNull()
                .isEqualTo(expectedRequest);
    }

    @Test
    void test_buildChallengeRequestWithPreviousData() {
        // given
        GptResponse previousResponse = new GptResponse(
                "testId",
                "chat.completion",
                42069,
                DEFAULT_MODEL,
                List.of(new GptResponse.Choices(
                        new PromptMessage("testPrompt", "testContent"),
                        null,
                        "stop",
                        0)),
                new GptResponse.Usage(
                        69,
                        420,
                        42069,
                        new GptResponse.Usage.CompletionTokensDetails(0, 0, 0)
                ));

        String previousArticle = previousResponse.choices().get(0).message().content();

        String systemPrompt = """
            You are always creating a single challenge for the reader to solve based on the provided article's content.
            The challenge should be achievable, not overly difficult, and take approximately 10 to 30 minutes to complete.
            The text should also be written in Markdown, like GitHub.
                        
            First line header should always be: # Challenge

            Start by providing a brief introduction to the challenge, followed by the challenge itself.
                        
            In instances where you need to generate code blocks, ensure to format them with triple backticks (`) and specify the code language.
            Here's an example:

            ```js
            // code here
            ```
                        
            Please refrain from generating image links and svg.
            """;

        String prompt = """
            Formulate a small interactive challenge based on the article you wrote previously.
            Coding Challenge should be similar to the ones of tech interview questions.
            Make sure that the Challenge is not too difficult and can be solved in 10 to 30 minutes.
                        
            This challenge should be carefully designed so as not to be overly complex, with an estimated completion time between 10 and 30 minutes.
            Furthermore, it should be crafted in a way that allows the reader to solve it directly within a web-based code editor.
                        
            You may provide hints but NEVER the solution.
                        
            The article you wrote previously and the challenge should be based on is as follows:
            ###
            %s
            ###
            """.formatted(previousArticle);

        GptRequest expectedRequest = new GptRequest(
                DEFAULT_MODEL,
                List.of(
                        new PromptMessage(
                                "system",
                                systemPrompt
                        ),
                        new PromptMessage(
                                "user",
                                prompt
                        )
                ),
                DEFAULT_TEMPERATURE
        );

        // when
        GptRequest request = promptBuilder.buildChallengeRequestWithPreviousData(previousResponse);

        // then
        Assertions.assertThat(request)
                .isNotNull()
                .isEqualTo(expectedRequest);
    }

    @Test
    void test_buildChallengeValidationRequest() {
        // given
        MongoUserWithoutPassword user = new MongoUserWithoutPassword(
                "testId",
                "testUsername"
        );

        WorkshopUserChallenge workshopUserChallenge = new WorkshopUserChallenge(
                user,
                "testTopic",
                "testSubTopic",
                "do a back flip",
                "for(int i = 0; i < 10; i++) {\n\tSystem.out.println(\"Back Flip!\");\n}"
        );

        String systemPrompt = """
            You are reviewing answers to a coding challenge, and you need to validate the answer.
                        
            The students answer is always ONLY CODE out of an editor.
            You NEVER write student, you ALWAYS address directly with "you".
                        
            Either the student has solved the challenge or not. The decision is binary.
            You decide if a student passes or fail, be fair. Solutions slightly partial answers are also acceptable.
            The challenges programming language was %s and the topic was %s.
                        
            First line of your response should ALWAYS be one of the 2 options:
                        
            >>>PASS<<< or >>>FAIL<<<
                        
            If you decide to pass the student, you should provide a short feedback on the solution followed by congratulations.
            Else if you decide to fail the student, you should provide a short feedback on the solution followed by a suggestion to improve.
            ONLY give hints, NEVER the complete solution.
                        
            The text after the first line SHOULD be written in Markdown, like GitHub.
                        
            In instances where you need to generate code blocks, ensure to format them with triple backticks (`) and specify the code language.
            Here's an example:

            ```js
            // code here
            ```
                        
            Please refrain from generating image links and svg.
                        
            Copy and pasting code from the challenge itself, should never lead to a PASS.
            """.formatted(workshopUserChallenge.language(), workshopUserChallenge.topic());

        String prompt = """
            This was the challenge:
            ###
            %s
            ###
                        
            Your task is to:
            Validate my answer to the challenge and provide short feedback.
                        
            You may provide hints but NEVER the solution.
                        
            My written code answer to the challenge was:
                        
            ###
            %s
            ###
                        
            After your task is done, finish up with:
            Suggest topics I should learn to improve, based on your assessment of the answer.
            Leave a short motivational message at the end.
            """.formatted(workshopUserChallenge.challenge(), workshopUserChallenge.answer());

        GptRequest expectedRequest = new GptRequest(
                DEFAULT_MODEL,
                List.of(
                        new PromptMessage(
                                "system",
                                systemPrompt
                        ),
                        new PromptMessage(
                                "user",
                                prompt
                        )
                ),
                DEFAULT_TEMPERATURE
        );

        // when
        GptRequest request = promptBuilder.buildChallengeValidationRequest(workshopUserChallenge);

        // then
        Assertions.assertThat(request)
                .isNotNull()
                .isEqualTo(expectedRequest);
    }
}
