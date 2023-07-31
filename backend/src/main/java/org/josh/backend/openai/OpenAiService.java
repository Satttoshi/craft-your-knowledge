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
}
