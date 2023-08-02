package org.josh.backend.dto;

public record WorkshopUserChallenge(
    String language,
    String topic,
    String challenge,
    String answer
) {
}
