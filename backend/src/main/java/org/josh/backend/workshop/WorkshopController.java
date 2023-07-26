package org.josh.backend.workshop;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/workshop")
@RestController
@RequiredArgsConstructor
public class WorkshopController {

    private final WorkshopService workshopService;

    @PostMapping
    public Workshop createWorkshop(@RequestBody WorkshopWithoutIdAndLikes workshop) {
        return workshopService.createWorkshop(workshop);
    }

    @GetMapping
    public List<Workshop> readWorkshops() {
        return workshopService.readWorkshops();
    }

}
