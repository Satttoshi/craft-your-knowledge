package org.josh.backend.workshop;

import lombok.RequiredArgsConstructor;
import org.josh.backend.security.MongoUserWithoutPassword;
import org.josh.backend.utils.IdService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkshopService {

    private final WorkshopRepository workshopRepository;
    private final IdService idService;

    public Workshop createWorkshop(WorkshopWithoutIdAndLikes workshop) {
        Workshop workshopToSave = new Workshop(
            idService.createId(),
            new MongoUserWithoutPassword("adminId", "AdminName"),
            workshop.topic(),
            workshop.subTopic(),
            workshop.buzzWords(),
            0,
            workshop.estimatedTimeToMaster(),
            workshop.difficulty(),
            new ArrayList<>()
        );
        return workshopRepository.save(workshopToSave);
    }

    public List<Workshop> readWorkshops() {
        return workshopRepository.findAll();
    }

    public Workshop updatePersonalStatus(String id, PersonalStatus personalStatus){
        Workshop workshopBefore = workshopRepository.findById(id).orElseThrow();
        List<PersonalStatus> personalStatuses = alterPersonalStatuses(personalStatus, workshopBefore);

        Workshop workshopToSave = new Workshop(
            workshopBefore.id(),
            workshopBefore.author(),
            workshopBefore.topic(),
            workshopBefore.subTopic(),
            workshopBefore.buzzWords(),
            workshopBefore.likes(),
            workshopBefore.estimatedTimeToMaster(),
            workshopBefore.difficulty(),
            personalStatuses
        );
        return workshopRepository.save(workshopToSave);
    }

    private static List<PersonalStatus> alterPersonalStatuses(PersonalStatus workshopPersonalStatus, Workshop workshopBefore) {
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

}
