package org.josh.backend.workshop;

import org.assertj.core.api.Assertions;
import org.josh.backend.exception.NoSuchWorkshopException;
import org.josh.backend.openai.OpenAiService;
import org.josh.backend.security.MongoUserWithoutPassword;
import org.josh.backend.utils.IdService;
import org.josh.backend.utils.ProgressStatus;
import org.junit.jupiter.api.Test;
import org.josh.backend.utils.Difficulty;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class WorkshopServiceTest {

    WorkshopRepository workshopRepo = mock(WorkshopRepository.class);
    IdService idService = mock(IdService.class);
    OpenAiService openAiService = mock(OpenAiService.class);
    WorkshopService workshopService = new WorkshopService(workshopRepo, idService, openAiService);


    PersonalStatus testPersonalStatus = new PersonalStatus(
        new MongoUserWithoutPassword(
            "fakeUserId69",
            "fakeUserName69"
        ),
        ProgressStatus.NOT_STARTED,
        true
    );

    Workshop testWorkshop = new Workshop(
        "fakeId69",
        new MongoUserWithoutPassword("fakeUserId69", "fakeUserName69"),
        "testTopic",
        "testSubTopic",
        List.of("testBuzzWord1", "testBuzzWord2"),
        0,
        0,
        Difficulty.EASY,
        List.of(testPersonalStatus)
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
        String fakeId = "fakeId69";
        when(idService.createId()).thenReturn(fakeId);
        when(workshopRepo.save(any(Workshop.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        Workshop actual = workshopService.createWorkshop(testWorkshopWithoutIdAndLikes);

        // then
        Assertions.assertThat(actual).isNotNull();
        Assertions.assertThat(actual.id()).isEqualTo(fakeId);
        verify(workshopRepo).save(any(Workshop.class));
    }

    @Test
    void test_readWorkshops() {
        // given
        // when
        when(workshopRepo.findAll()).thenReturn(List.of(testWorkshop));
        List<Workshop> actual = workshopService.readWorkshops();

        // then
        Assertions.assertThat(actual).containsExactly(testWorkshop);
        verify(workshopRepo).findAll();
    }

    @Test
    void test_updatePersonalStatus() {
        // given
        // when
        when(workshopRepo.findById("fakeId69")).thenReturn(Optional.of(testWorkshop));
        when(workshopRepo.save(testWorkshop)).thenReturn(testWorkshop);
        Workshop actual = workshopService.updatePersonalStatus("fakeId69", testPersonalStatus);

        // then
        Assertions.assertThat(actual).isEqualTo(testWorkshop);
        verify(workshopRepo).findById("fakeId69");
    }

    @Test
    void test_deleteWorkshop(){
        //Given
        String id = "fakeId69";
        //When
        when(workshopRepo.existsById(id)).thenReturn(true);
        workshopService.deleteWorkshop(id);
        //Then
        verify(workshopRepo).deleteById(id);
    }

    @Test
    void expectNoSuchWorkshopException_whenDeleteWorkshopByInvalidId() {
        //Given
        String invalidId = "invalidId";
        //When
        //Then
        assertThrows(NoSuchWorkshopException.class, () -> workshopService.deleteWorkshop(invalidId));
    }

}
