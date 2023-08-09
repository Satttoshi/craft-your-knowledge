package org.josh.backend.dto;

public record UserWithoutId(
    String name,
    String password) {
}
