package org.josh.backend.workshop;

import org.assertj.core.api.Assertions;
import org.josh.backend.dto.Gpt3TurboRequest;
import org.josh.backend.dto.Gpt3TurboResponse;
import org.josh.backend.dto.WorkshopFormData;
import org.josh.backend.dto.WorkshopUserChallenge;
import org.josh.backend.exception.NoSuchWorkshopException;
import org.josh.backend.openai.*;
import org.josh.backend.security.MongoUserDetailsService;
import org.josh.backend.security.MongoUserWithoutPassword;
import org.josh.backend.utils.IdService;
import org.josh.backend.utils.ProgressStatus;
import org.junit.jupiter.api.Test;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class WorkshopServiceTest {

    WorkshopRepository workshopRepo = mock(WorkshopRepository.class);
    IdService idService = mock(IdService.class);
    OpenAiService openAiService = mock(OpenAiService.class);
    PromptBuilder promptBuilder = mock(PromptBuilder.class);
    MongoUserDetailsService mongoUserDetailsService = mock(MongoUserDetailsService.class);
    WorkshopService workshopService = new WorkshopService(workshopRepo, idService, openAiService, promptBuilder,
        mongoUserDetailsService);
    Principal principal = mock(Principal.class);

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
        List.of(testPersonalStatus),
        null,
        null
    );

    WorkshopFormData testWorkshopFormData = new WorkshopFormData(
        "testTopic",
        "testSubTopic",
        List.of("testBuzzWord1", "testBuzzWord2")
    );

    WorkshopUserChallenge workshopUserChallenge = new WorkshopUserChallenge(
        new MongoUserWithoutPassword("fakeUserId69", "fakeUserName69"),
        "testTopic",
        "testSubTopic",
        "do back flips",
        "i dont do back flips"
    );

    @Test
    void test_createWorkshop() {
        // given

        Gpt3TurboRequest challengeRequest = new Gpt3TurboRequest(
            "gpt-3.5-turbo",
            List.of(
                new PromptMessage(
                    "system",
                    "testSystemPrompt"
                ),
                new PromptMessage(
                    "user",
                    "testUserPrompt"
                )
            )
        );

        String fakeId = "fakeId69";
        when(idService.createId()).thenReturn(fakeId);
        when(workshopRepo.save(any(Workshop.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(promptBuilder.buildChallengeRequestWithPreviousData(any(Gpt3TurboResponse.class))).thenReturn(challengeRequest);

        // when
        Workshop actual = workshopService.createWorkshop(testWorkshopFormData);

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
    void test_getWorkshopById() {
        // given
        String id = "testId42069";
        Workshop expected = testWorkshop;

        // when
        when(workshopRepo.findById(id)).thenReturn(Optional.of(expected));
        Workshop actual = workshopService.getWorkshopById(id);

        // then
        Assertions.assertThat(actual).isEqualTo(expected);
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
    void test_likeAndUnlikeWorkshop() {
        // Given
        String id = "fakeId69";
        when(principal.getName()).thenReturn("fakeUserName69");
        when(workshopRepo.findById(id)).thenReturn(Optional.of(testWorkshop));
        when(mongoUserDetailsService.getUserIdByUsername("fakeUserName69")).thenReturn("fakeUserId69");
        when(workshopRepo.save(any())).thenReturn(testWorkshop);

        // When
        Workshop actual = workshopService.likeAndUnlikeWorkshop(id, principal);

        // Then
        Assertions.assertThat(actual).isEqualTo(testWorkshop);
        verify(workshopRepo).save(any());
    }

    @Test
    void test_deleteWorkshop() {
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

    @Test
    void test_validateChallenge() {
        //given

        Gpt3TurboRequest challengeRequest = new Gpt3TurboRequest(
            "gpt-3.5-turbo",
            List.of(
                new PromptMessage(
                    "system",
                    "testSystemPrompt"
                ),
                new PromptMessage(
                    "user",
                    "testUserPrompt"
                )
            )
        );

        Gpt3TurboResponse challengeResponse = new Gpt3TurboResponse(
            "fakeId69",
            "chat.completion",
            42069,
            List.of(new Gpt3TurboResponse.Choices(
                0,
                new PromptMessage(
                    "assistant",
                    ">>>PASS<<<You did it!"
                ),
                "stop")
            ),
            new Gpt3TurboResponse.Usage(
                42069,
                42069,
                42069)

        );

        String fakeId = "fakeId69";
        when(idService.createId()).thenReturn(fakeId);
        when(workshopRepo.existsById(fakeId)).thenReturn(true);
        when(promptBuilder.buildChallengeValidationRequest(workshopUserChallenge)).thenReturn(challengeRequest);
        when(openAiService.getResponse(challengeRequest)).thenReturn(challengeResponse);
        when(workshopRepo.findById(fakeId)).thenReturn(Optional.of(testWorkshop));

        // when
        Gpt3TurboResponse actual = workshopService.validateChallenge(fakeId, workshopUserChallenge);

        // then
        Assertions.assertThat(actual).isNotNull();
        Assertions.assertThat(actual.id()).isEqualTo(fakeId);

    }

    @Test
    void expectNoSuchWorkshopException_whenValidateChallengeWithInvalidId() {
        //Given
        String invalidId = "invalidId";
        //When
        //Then
        assertThrows(NoSuchWorkshopException.class, () -> workshopService.validateChallenge(invalidId,
            workshopUserChallenge));
    }

}
