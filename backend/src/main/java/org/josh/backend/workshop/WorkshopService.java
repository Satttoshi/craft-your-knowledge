package org.josh.backend.workshop;

import lombok.RequiredArgsConstructor;
import org.josh.backend.utils.IdService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkshopService {

    private final WorkshopRepository workshopRepository;
    private final IdService idService;

    public Workshop createWorkshop(WorkshopWithoutIdAndLikes workshop) {
        Workshop workshopToSave = new Workshop(
                idService.createId(),
                workshop.topic(),
                workshop.subTopic(),
                workshop.buzzWords(),
                0,
                workshop.estimatedTimeToMaster(),
                workshop.difficulty()
        );
        return workshopRepository.save(workshopToSave);
    }
}
