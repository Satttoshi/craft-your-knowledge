package org.josh.backend.security;

public record UserWithoutId(
    String name,
    String password) {
}
