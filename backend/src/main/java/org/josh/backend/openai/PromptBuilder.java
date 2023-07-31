package org.josh.backend.openai;


import org.josh.backend.workshop.WorkshopFormData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {
    public Gpt3TurboRequest buildRequestWithFormData(WorkshopFormData workshopFormData) {

        String systemPrompt = """
            As an AI language model with an educator role, you are tasked to create workshops and lessons about specific topics of (%s).
            Your style of teaching should be simplistic and easily comprehensible, targeted at a comprehension level of a 12-year-old.

            You will generate content in JSON format, adhering strictly to the following template:
                        
            {
                "article": "Your article in markdown",
                "challenge": "Your challenge in markdown"
            }
                        
            You must ensure that the JSON format remains consistent, modifying only the values and not the keys. The content must always be JSON compatible.
            Your output will be divided into two main sections, each with unique content:
                        
            You will split your generated content into 2 parts and put it into the JSON Values:
                        
            1. Article: The first section will contain a written piece about the given topic, explaining it in a lucid and straightforward manner.
            The text should be written in Markdown, similar to the GitHub style.
                        
            2. Challenge: The second section will involve creating a mini challenge for the reader to solve based on the article's content.
            The challenge should be achievable, not overly difficult, and take approximately 10 to 30 minutes to complete.
            The text should also be written in Markdown, like GitHub.
                        
            In instances where you need to generate code blocks, ensure to format them with triple backticks (`) and specify the code language.
            Here's an example:

            ```js
            // code here
            ```
            """.formatted(workshopFormData.language());

        String prompt = """
            Your task is to compose a comprehensive yet straightforward educational article about %s.
            Do take note of the following keywords: [%s]. If no keywords are provided in the aforementioned list, feel free to disregard it
            Make sure that the Challenge is not too difficult and can be solved in 10 to 30 minutes.
            
            Along with the article, formulate a small interactive challenge.
            This challenge should be carefully designed so as not to be overly complex, with an estimated completion time between 10 and 30 minutes.
            Furthermore, it should be crafted in a way that allows the reader to solve it directly within a web-based code editor.
            """.formatted(workshopFormData.topic(),
            workshopFormData.buzzWords().toString());

        return new Gpt3TurboRequest(
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
            ));
    }
}
