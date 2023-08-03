package org.josh.backend.workshop;

import org.josh.backend.dto.Gpt3TurboResponse;
import org.josh.backend.security.MongoUserWithoutPassword;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("workshops")
public record Workshop(

    @Id
    String id,
    MongoUserWithoutPassword author,
    String language,
    String topic,
    List<String> buzzWords,
    int likes,
    List<PersonalStatus> personalStatuses,
    Gpt3TurboResponse article,
    Gpt3TurboResponse challenge
) {
}
