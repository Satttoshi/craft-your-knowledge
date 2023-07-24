package org.josh.backend.workshop;

public record WorkshopWithoutId(
    String mainTopic,
    String subTopic,
    String buzzWords,
    int likes,
    int estimatedTimeToMaster,
    String difficulty
) {
}
