package org.josh.backend.workshop;

import lombok.RequiredArgsConstructor;
import org.josh.backend.dto.WorkshopFormData;
import org.josh.backend.dto.WorkshopUserChallenge;
import org.josh.backend.exception.NoSuchWorkshopException;
import org.josh.backend.dto.Gpt3TurboRequest;
import org.josh.backend.dto.Gpt3TurboResponse;
import org.josh.backend.openai.OpenAiService;
import org.josh.backend.openai.PromptBuilder;
import org.josh.backend.security.MongoUserDetailsService;
import org.josh.backend.security.MongoUserWithoutPassword;
import org.josh.backend.utils.IdService;
import org.josh.backend.utils.ProgressStatus;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkshopService {

    private final WorkshopRepository workshopRepository;
    private final IdService idService;
    private final OpenAiService openAiService;
    private final PromptBuilder promptBuilder;
    private final MongoUserDetailsService mongoUserDetailsService;

    public Workshop createWorkshop(WorkshopFormData workshopFormData) {

        Gpt3TurboRequest articleRequest = promptBuilder.buildRequestWithFormData(workshopFormData);
        Gpt3TurboResponse articleResponse = openAiService.getResponse(articleRequest);

        Gpt3TurboRequest challengeRequest = promptBuilder.buildChallengeRequestWithPreviousData(articleResponse);
        Gpt3TurboResponse challengeResponse = openAiService.getResponse(challengeRequest);

        Workshop workshopToSave = new Workshop(
            idService.createId(),
            new MongoUserWithoutPassword("adminId", "AdminName"),
            workshopFormData.language(),
            workshopFormData.topic(),
            workshopFormData.buzzWords(),
            0,
            new ArrayList<>(),
            articleResponse,
            challengeResponse
        );
        return workshopRepository.save(workshopToSave);
    }

    public List<Workshop> readWorkshops() {
        return workshopRepository.findAll();
    }

    public Workshop getWorkshopById(String id) {
        return workshopRepository.findById(id).orElseThrow(() -> new NoSuchWorkshopException("No workshop found with " +
                                                                                             "Id: " + id));
    }

    public Workshop updatePersonalStatus(String id, PersonalStatus personalStatus) {
        Workshop workshopBefore = workshopRepository.findById(id).orElseThrow();
        List<PersonalStatus> personalStatuses = alterPersonalStatuses(personalStatus, workshopBefore);

        Workshop workshopToSave = new Workshop(
            workshopBefore.id(),
            workshopBefore.author(),
            workshopBefore.language(),
            workshopBefore.topic(),
            workshopBefore.buzzWords(),
            workshopBefore.likes(),
            personalStatuses,
            workshopBefore.article(),
            workshopBefore.challenge()
        );
        return workshopRepository.save(workshopToSave);
    }

    public Workshop likeAndUnlikeWorkshop(String workshopId, Principal principal) {
        Workshop workshopBefore = workshopRepository.findById(workshopId).orElseThrow();
        String username = principal.getName();
        String userId = mongoUserDetailsService.getUserIdByUsername(username);

        PersonalStatus currentUserPersonalStatus = null;
        for (PersonalStatus personalStatus : workshopBefore.personalStatuses()) {
            if (personalStatus.user().id().equals(userId)) {
                currentUserPersonalStatus = personalStatus;
                break;
            }
        }

        if (currentUserPersonalStatus == null) {
           currentUserPersonalStatus = new PersonalStatus(
               new MongoUserWithoutPassword(userId, username),
               ProgressStatus.NOT_STARTED,
               false
           );
        }

        currentUserPersonalStatus = new PersonalStatus(
            currentUserPersonalStatus.user(),
            currentUserPersonalStatus.progressStatus(),
            !currentUserPersonalStatus.isLiked()
        );

        List<PersonalStatus> personalStatuses = alterPersonalStatuses(currentUserPersonalStatus, workshopBefore);

        Workshop workshopToSave = new Workshop(
            workshopBefore.id(),
            workshopBefore.author(),
            workshopBefore.language(),
            workshopBefore.topic(),
            workshopBefore.buzzWords(),
            currentUserPersonalStatus.isLiked() ? workshopBefore.likes() + 1 : workshopBefore.likes() - 1,
            personalStatuses,
            workshopBefore.article(),
            workshopBefore.challenge()
        );

        return workshopRepository.save(workshopToSave);
    }

    private static List<PersonalStatus> alterPersonalStatuses(PersonalStatus workshopPersonalStatus,
                                                              Workshop workshopBefore) {
        // Search if user already has a personal status for this workshop and update it if so or add it if not
        List<PersonalStatus> personalStatuses = new ArrayList<>(workshopBefore.personalStatuses());
        int indexToUpdate = -1;
        for (int i = 0; i < personalStatuses.size(); i++) {
            PersonalStatus personalStatus = personalStatuses.get(i);
            if (personalStatus.user().equals(workshopPersonalStatus.user())) {
                indexToUpdate = i;
                break;
            }
        }

        if (indexToUpdate == -1) {
            personalStatuses.add(workshopPersonalStatus);
        } else {
            personalStatuses.set(indexToUpdate, workshopPersonalStatus);
        }
        return personalStatuses;
    }

    public void deleteWorkshop(String id) {
        if (!workshopRepository.existsById(id)) {
            throw new NoSuchWorkshopException("No workshop found with Id: " + id);
        }
        workshopRepository.deleteById(id);
    }

    public Gpt3TurboResponse validateChallenge(String id, WorkshopUserChallenge workshopUserChallenge) {
        if (!workshopRepository.existsById(id)) {
            throw new NoSuchWorkshopException("No workshop found with Id: " + id);
        }
        Gpt3TurboRequest validationRequest = promptBuilder.buildChallengeValidationRequest(workshopUserChallenge);
        Gpt3TurboResponse validationResponse = openAiService.getResponse(validationRequest);
        if (validationResponse.choices().get(0).message().content().contains(">>>PASS<<<")) {
            PersonalStatus personalStatus = new PersonalStatus(workshopUserChallenge.user(), ProgressStatus.COMPLETED
                , true);
            updatePersonalStatus(id, personalStatus);
        }
        return validationResponse;
    }

}
