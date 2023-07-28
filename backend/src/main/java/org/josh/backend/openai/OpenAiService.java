package org.josh.backend.openai;

import jakarta.annotation.PostConstruct;
import org.josh.backend.workshop.WorkshopFormData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Objects;

@Service
public class OpenAiService {

    @Value("${openai.api.key}")
    private String openAiApiKey;
    private WebClient client;

    @PostConstruct
    public void init() {
        client = WebClient.builder()
            .baseUrl("https://api.openai.com/v1/chat/completions")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
            .build();
    }

    public Gpt3TurboResponse getResponse(Gpt3TurboRequest request) {
        ResponseEntity<Gpt3TurboResponse> responseEntity = client.post()
            .bodyValue(request)
            .retrieve()
            .toEntity(Gpt3TurboResponse.class)
            .block();
        return Objects.requireNonNull(responseEntity).getBody();
    }

    public Gpt3TurboRequest buildRequestWithFormData(WorkshopFormData workshopFormData) {

        String systemPrompt = """
            You are a helpful assistant teaching about %s.
            You write in Markdown how it is done in Github.
            If you generate code ALWAYS format with triple backticks and the language.
            """.formatted(workshopFormData.topic());

        String prompt = """
            Write an article about %s.
            The article should be easy to understand.
            The difficulty level should be %s.
            Difficulty means how hard it is to understand. usually from junior to senior.
            The estimated time to master should be %d minutes.
            Please Consider the following buzz words:[ %s ], if no buzz words are provided in previous array, please ignore this.
            Add a little challenge to the end and consider the estimated time to master and difficulty level to determine the challenge.
            """.formatted(workshopFormData.subTopic(),
            workshopFormData.difficulty().toString(), workshopFormData.estimatedTimeToMaster(),
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
