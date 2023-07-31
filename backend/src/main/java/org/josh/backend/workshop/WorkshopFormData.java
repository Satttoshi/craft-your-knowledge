package org.josh.backend.workshop;

import java.util.List;

public record WorkshopFormData(
    String language,
    String topic,
    List<String> buzzWords
) {
}
