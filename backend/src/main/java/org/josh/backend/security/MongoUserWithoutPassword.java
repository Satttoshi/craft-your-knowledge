package org.josh.backend.security;

import org.springframework.data.annotation.Id;

public record MongoUserWithoutPassword(
    @Id
    String id,
    String name
) {
}
