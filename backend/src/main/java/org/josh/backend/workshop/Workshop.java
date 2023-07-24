package org.josh.backend.workshop;

import org.josh.backend.utils.Difficulty;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("workshops")
public record Workshop(

    String id,
    String mainTopic,
    String subTopic,
    String buzzWords,
    int likes,
    int estimatedTimeToMaster,
    Difficulty difficulty
) {
}
