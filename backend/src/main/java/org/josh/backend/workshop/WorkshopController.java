package org.josh.backend.workshop;

import lombok.RequiredArgsConstructor;
import org.josh.backend.dto.WorkshopFormData;
import org.josh.backend.dto.WorkshopUserChallenge;
import org.josh.backend.exception.ErrorMessage;
import org.josh.backend.exception.NoSuchWorkshopException;
import org.josh.backend.dto.GptResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RequestMapping("api/workshop")
@RestController
@RequiredArgsConstructor
public class WorkshopController {

    private final WorkshopService workshopService;

    @PostMapping
    public Workshop createWorkshop(@RequestBody WorkshopFormData workshop) {
        return workshopService.createWorkshop(workshop);
    }

    @GetMapping
    public List<Workshop> readWorkshops() {
        return workshopService.readWorkshops();
    }

    @GetMapping("/{id}")
    public Workshop getWorkshopById(@PathVariable String id) {
        return workshopService.getWorkshopById(id);
    }

    @PutMapping("/{id}")
    public Workshop updatePersonalStatus(@PathVariable String id, @RequestBody PersonalStatus personalStatus) {
        return workshopService.updatePersonalStatus(id, personalStatus);
    }

    @PutMapping("/like/{workshopId}")
    public Workshop likeWorkshop(@PathVariable String workshopId, Principal principal) {
        return workshopService.likeAndUnlikeWorkshop(workshopId, principal);
    }

    @DeleteMapping("/{id}")
    public void deleteWorkshop(@PathVariable String id) {
        workshopService.deleteWorkshop(id);
    }

    @PostMapping("/{id}/validate")
    public GptResponse validateChallenge(@PathVariable String id, @RequestBody WorkshopUserChallenge workshopUserChallenge) {
        return workshopService.validateChallenge(id, workshopUserChallenge);
    }

    @ExceptionHandler({NoSuchWorkshopException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorMessage handleNoSuchElementExceptions(NoSuchWorkshopException exception) {
        return new ErrorMessage(exception.getMessage());
    }

}
