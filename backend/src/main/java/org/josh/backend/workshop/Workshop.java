package org.josh.backend.workshop;

import org.josh.backend.utils.Difficulty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("workshops")
public record Workshop(

    @Id
    String id,
    String topic,
    String subTopic,
    List<String> buzzWords,
    int likes,
    int estimatedTimeToMaster,
    Difficulty difficulty,
    List<WorkshopPersonalStatus> workshopPersonalStatuses
) {
}
