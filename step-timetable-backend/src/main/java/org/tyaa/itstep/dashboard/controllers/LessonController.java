package org.tyaa.itstep.dashboard.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.tyaa.itstep.dashboard.models.LessonModel;
import org.tyaa.itstep.dashboard.services.LessonReactiveService;

@RestController
@RequestMapping("/api/lessons")
public class LessonController implements IRestControllerBase<LessonModel, String> {

    final LessonReactiveService lessonService;

    public LessonController(LessonReactiveService lessonService) {
        this.lessonService = lessonService;
    }

    @Override
    @PostMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void create(@RequestBody LessonModel lesson) {
        lessonService.create(lesson);
    }

    @Override
    @GetMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void request() {
        lessonService.request();
    }

    @Override
    @PutMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void update(@RequestBody LessonModel lesson) {
        lessonService.update(lesson);
    }

    @Override
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(@PathVariable String id) {
        lessonService.delete(id);
    }
}
