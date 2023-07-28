package org.josh.backend.workshop;

import org.josh.backend.utils.Difficulty;

import java.util.List;

public record WorkshopFormData(
    String topic,
    String subTopic,
    List<String> buzzWords,
    int estimatedTimeToMaster,
    Difficulty difficulty
) {
}
