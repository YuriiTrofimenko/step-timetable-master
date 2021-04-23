package org.tyaa.itstep.dashboard.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.tyaa.itstep.dashboard.models.LecturerModel;
import org.tyaa.itstep.dashboard.services.LecturerReactiveService;

@RestController
@RequestMapping("/api/lecturers")
public class LecturerController implements IRestControllerBase<LecturerModel, String> {

    final LecturerReactiveService lecturerService;

    public LecturerController(LecturerReactiveService lecturerService) {
        this.lecturerService = lecturerService;
    }

    @Override
    @PostMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void create(@RequestBody LecturerModel lecturer) {
        lecturerService.create(lecturer);
    }

    @Override
    @GetMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void request() {
        lecturerService.request();
    }

    @Override
    @PutMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void update(@RequestBody LecturerModel lecturer) {
        lecturerService.update(lecturer);
    }

    @Override
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(@PathVariable String id) {
        lecturerService.delete(id);
    }
}
