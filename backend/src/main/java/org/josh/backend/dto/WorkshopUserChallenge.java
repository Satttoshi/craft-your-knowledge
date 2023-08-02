package org.josh.backend.dto;

import org.josh.backend.security.MongoUser;
import org.josh.backend.security.MongoUserWithoutPassword;

public record WorkshopUserChallenge(

    MongoUserWithoutPassword user,
    String language,
    String topic,
    String challenge,
    String answer
) {
}
