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

    public Workshop updateWorkshop(String id, WorkshopWithoutIdAndLikes workshop) {
        Workshop workshopBefore = workshopRepository.findById(id).orElseThrow();
        Workshop workshopToSave = new Workshop(
                id,
                new MongoUserWithoutPassword("adminId", "AdminName"),
                workshop.topic(),
                workshop.subTopic(),
                workshop.buzzWords(),
                workshopBefore.likes(),
                workshop.estimatedTimeToMaster(),
                workshop.difficulty(),
                workshopBefore.workshopPersonalStatuses()
        );
        return workshopRepository.save(workshopToSave);
    }

}
