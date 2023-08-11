package org.josh.backend.dto;

public record UserWithoutId(
    String username,
    String password) {
}
