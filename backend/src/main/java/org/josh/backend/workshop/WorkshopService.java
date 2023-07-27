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

    public Workshop updateWorkshopPersonalStatus(String id, WorkshopPersonalStatus workshopPersonalStatus){
        Workshop workshopBefore = workshopRepository.findById(id).orElseThrow();
        List<WorkshopPersonalStatus> workshopPersonalStatuses = getWorkshopPersonalStatuses(workshopPersonalStatus, workshopBefore);

        Workshop workshopToSave = new Workshop(
            workshopBefore.id(),
            workshopBefore.author(),
            workshopBefore.topic(),
            workshopBefore.subTopic(),
            workshopBefore.buzzWords(),
            workshopBefore.likes(),
            workshopBefore.estimatedTimeToMaster(),
            workshopBefore.difficulty(),
            workshopPersonalStatuses
        );
        return workshopRepository.save(workshopToSave);
    }

    private static List<WorkshopPersonalStatus> getWorkshopPersonalStatuses(WorkshopPersonalStatus workshopPersonalStatus, Workshop workshopBefore) {
        List<WorkshopPersonalStatus> workshopPersonalStatuses = new ArrayList<>(workshopBefore.workshopPersonalStatuses());

        int indexToUpdate = -1;
        for (int i = 0; i < workshopPersonalStatuses.size(); i++) {
            WorkshopPersonalStatus personalStatus = workshopPersonalStatuses.get(i);
            if (personalStatus.user().equals(workshopPersonalStatus.user())) {
                indexToUpdate = i;
                break;
            }
        }

        if (indexToUpdate == -1) {
            workshopPersonalStatuses.add(workshopPersonalStatus);
        } else {
            workshopPersonalStatuses.set(indexToUpdate, workshopPersonalStatus);
        }
        return workshopPersonalStatuses;
    }

}
