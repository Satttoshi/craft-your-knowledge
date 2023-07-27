package org.josh.backend.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ProgressStatusTest {
    @Test
    void testEnumValues() {
        //GIVEN
        ProgressStatus notStarted = ProgressStatus.NOT_STARTED;
        ProgressStatus inProgress = ProgressStatus.IN_PROGRESS;
        ProgressStatus completed = ProgressStatus.COMPLETED;

        //WHEN
        //THEN
        assertEquals("NOT_STARTED", notStarted.name());
        assertEquals("IN_PROGRESS", inProgress.name());
        assertEquals("COMPLETED", completed.name());
    }
}
