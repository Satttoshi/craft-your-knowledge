package org.josh.backend.workshop;

import org.assertj.core.api.Assertions;
import org.josh.backend.utils.IdService;
import org.junit.jupiter.api.Test;
import org.josh.backend.utils.Difficulty;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class WorkshopServiceTest {

    WorkshopRepository workshopRepo = mock(WorkshopRepository.class);
    IdService idService = mock(IdService.class);
    WorkshopService workshopService = new WorkshopService(workshopRepo, idService);

    Workshop testWorkshop = new Workshop(
        "fakeId69",
        "testTopic",
        "testSubTopic",
        List.of("testBuzzWord1", "testBuzzWord2"),
        0,
        0,
        Difficulty.EASY
    );

    WorkshopWithoutIdAndLikes testWorkshopWithoutIdAndLikes = new WorkshopWithoutIdAndLikes(
        "testTopic",
        "testSubTopic",
        List.of("testBuzzWord1", "testBuzzWord2"),
        0,
        Difficulty.EASY
    );

    @Test
    void test_createWorkshop() {
        // given
        when(idService.createId()).thenReturn("fakeId69");
        when(workshopRepo.save(testWorkshop)).thenReturn(testWorkshop);

        // when
        Workshop actual = workshopService.createWorkshop(testWorkshopWithoutIdAndLikes);

        // then
        Assertions.assertThat(actual).isEqualTo(testWorkshop);
    }


}