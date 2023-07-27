package org.josh.backend.security;

import org.springframework.data.annotation.Id;

public record MongoUserWithIdAndName(
    @Id
    String id,
    String username
) {
}
