package org.josh.backend.dto;

import java.util.List;

public record WorkshopFormData(
    String language,
    String topic,
    List<String> buzzWords
) {
}
