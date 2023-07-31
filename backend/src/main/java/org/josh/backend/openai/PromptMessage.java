package org.josh.backend.openai;

public record PromptMessage (
    String role,
    String content
){
}
