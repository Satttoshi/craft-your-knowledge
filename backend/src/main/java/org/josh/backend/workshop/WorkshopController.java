package org.josh.backend.workshop;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("api/workshop")
@RestController
@RequiredArgsConstructor
public class WorkshopController {

    private final WorkshopService workshopService;

    @PostMapping
    public Workshop addWorkshop(@RequestBody Workshop workshop) {
        return workshopService.addWorkshop(workshop);
    }

}
