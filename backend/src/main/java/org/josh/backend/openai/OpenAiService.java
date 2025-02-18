package org.josh.backend.openai;

import jakarta.annotation.PostConstruct;
import org.josh.backend.dto.GptRequest;
import org.josh.backend.dto.GptResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;

@Service
public class OpenAiService {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    @Value("${openai.temperature:0.7}")
    private double temperature;

    private WebClient client;

    @PostConstruct
    public void init() {
        client = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
                .build();
    }

    public GptResponse getResponse(GptRequest request) {
        // Override the model to use gpt-4o-mini
        GptRequest updatedRequest = new GptRequest(
                "gpt-4o-mini",
                request.messages(),
                temperature
        );

        return client.post()
                .bodyValue(updatedRequest)
                .retrieve()
                .onStatus(
                        status -> status.equals(HttpStatus.TOO_MANY_REQUESTS),
                        response -> Mono.error(new RuntimeException("Rate limit exceeded"))
                )
                .bodyToMono(GptResponse.class)
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .filter(throwable -> throwable instanceof RuntimeException)
                )
                .block();
    }
}
