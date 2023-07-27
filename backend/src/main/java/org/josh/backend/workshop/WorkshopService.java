package org.josh.backend.workshop;

import lombok.RequiredArgsConstructor;
import org.josh.backend.security.MongoUser;
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
}
