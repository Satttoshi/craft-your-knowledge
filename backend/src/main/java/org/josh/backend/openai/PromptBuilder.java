package org.josh.backend.openai;

import org.josh.backend.dto.Gpt3TurboRequest;
import org.josh.backend.dto.Gpt3TurboResponse;
import org.josh.backend.dto.WorkshopFormData;
import org.josh.backend.dto.WorkshopUserChallenge;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {

    private static final String MODEL = "gpt-3.5-turbo";
    public Gpt3TurboRequest buildRequestWithFormData(WorkshopFormData workshopFormData) {

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

        return new Gpt3TurboRequest(
            MODEL,
            List.of(
                new PromptMessage(
                    "system",
                    systemPrompt
                ),
                new PromptMessage(
                    "user",
                    prompt
                )
            ));
    }

    public Gpt3TurboRequest buildChallengeRequestWithPreviousData(Gpt3TurboResponse previousResponse) {

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
            """;

        String prompt = """
            Formulate a small interactive challenge based on the article you wrote previously.
            Make sure that the Challenge is not too difficult and can be solved in 10 to 30 minutes.
            
            This challenge should be carefully designed so as not to be overly complex, with an estimated completion time between 10 and 30 minutes.
            Furthermore, it should be crafted in a way that allows the reader to solve it directly within a web-based code editor.
            
            You may provide hints but NEVER the solution.
            
            The article you wrote previously and the challenge should be based on is as follows:
            ###
            %s
            ###
            """.formatted(previousArticle);

        return new Gpt3TurboRequest(
            MODEL,
            List.of(
                new PromptMessage(
                    "system",
                    systemPrompt
                ),
                new PromptMessage(
                    "user",
                    prompt
                )
            ));
    }

    public Gpt3TurboRequest buildChallengeValidationRequest(WorkshopUserChallenge workshopUserChallenge){

        String systemPrompt = """
            You are reviewing answers to a coding challenge, and you need to validate the answer.
            
            The students answer is always ONLY CODE out of an editor.
            
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
            """.formatted(workshopUserChallenge.language(), workshopUserChallenge.topic());

        String prompt = """
            This was the challenge:
            ###
            %s
            ###
            
            Your task is to:
            Validate the students answer to the challenge and provide short feedback.
            
            You may provide hints but NEVER the solution.
            
            The students code answer to the challenge was:
            
            ###
            %s
            ###
            
            After your task is done, finish up with:
            Suggest topics the student should learn to improve, based on your assessment of the answer.
            Leave a short motivational message at the end.
            """.formatted(workshopUserChallenge.challenge(), workshopUserChallenge.answer());


        return new Gpt3TurboRequest(
            MODEL,
            List.of(
                new PromptMessage(
                    "system",
                    systemPrompt
                ),
                new PromptMessage(
                    "user",
                    prompt
                )
            ));
    }
}
