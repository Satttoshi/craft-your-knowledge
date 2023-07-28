package org.josh.backend.openai;

import jakarta.annotation.PostConstruct;
import org.josh.backend.workshop.WorkshopFormData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;


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

    public GPT3TurboResponse getResponse(Gpt3TurboRequest request) {
        return client.post()
            .bodyValue(request)
            .retrieve()
            .bodyToMono(GPT3TurboResponse.class)
            .block();
    }

    public Gpt3TurboRequest createRequest(WorkshopFormData workshopFormData) {
        return new Gpt3TurboRequest(
            "gpt-3.5-turbo",
            List.of(
                new PromptMessage(
                    "system",
                    "You are a helpful assistant"
                ),
                new PromptMessage(
                    "user",
                    "prompt"
                )
            )
        );
    }

}
