package org.josh.backend.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DifficultyTest {

    @Test
    void testEnumValues() {
        //GIVEN
        Difficulty easy = Difficulty.EASY;
        Difficulty medium = Difficulty.MEDIUM;
        Difficulty hard = Difficulty.HARD;

        //WHEN
        //THEN
        assertEquals("EASY", easy.name());
        assertEquals("MEDIUM", medium.name());
        assertEquals("HARD", hard.name());
    }

}
