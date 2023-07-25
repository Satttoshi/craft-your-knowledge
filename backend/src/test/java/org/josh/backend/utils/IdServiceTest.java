package org.josh.backend.utils;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class IdServiceTest {

    @Test
    void testCreateId() {
        //GIVEN
        IdService idService = new IdService();

        //WHEN
        String id = idService.createId();

        //THEN
        assertEquals(36, id.length()); // UUIDs have a fixed length of 36 characters
    }

    @Test
    void testCreateIdWithMockito() {
        //GIVEN
        IdService idService = Mockito.mock(IdService.class);

        //WHEN
        when(idService.createId()).thenReturn("mocked-id");
        String id = idService.createId();

        //THEN
        assertEquals("mocked-id", id);
    }
}
