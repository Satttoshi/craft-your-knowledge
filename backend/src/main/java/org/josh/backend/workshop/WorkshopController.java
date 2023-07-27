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

    @PutMapping("/{id}")
    public Workshop updatePersonalStatus(@PathVariable String id, @RequestBody PersonalStatus personalStatus) {
        return workshopService.updatePersonalStatus(id, personalStatus);
    }

    @DeleteMapping("/{id}")
    public void deleteWorkshop(@PathVariable String id) {
        workshopService.deleteWorkshop(id);
    }
}
