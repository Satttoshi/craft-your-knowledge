package org.josh.backend.utils;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.Mockito.when;

class IdServiceTest {

    private final IdService idService = Mockito.mock(IdService.class) ;

    @Test
    void test_getUUID(){
        //GIVEN
        String expected = "aBcDeF69";

        //WHEN
        when(idService.createId()).thenReturn(expected);
        String actual = idService.createId();

        //THEN
        Assertions.assertThat(actual).isEqualTo(expected);
    }
}
