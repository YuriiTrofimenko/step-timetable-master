package org.tyaa.itstep.dashboard.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.tyaa.itstep.dashboard.models.LessonModel;
import org.tyaa.itstep.dashboard.models.TimeIntervalModel;
import org.tyaa.itstep.dashboard.services.TimeIntervalReactiveService;

@RestController
@RequestMapping("/api/intervals")
public class TimeIntervalController implements IRestControllerBase<TimeIntervalModel, String> {

    final TimeIntervalReactiveService timeIntervalService;

    public TimeIntervalController(TimeIntervalReactiveService timeIntervalService) {
        this.timeIntervalService = timeIntervalService;
    }

    @Override
    @PostMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void create(@RequestBody TimeIntervalModel timeInterval) {
        timeIntervalService.create(timeInterval);
    }

    @Override
    @GetMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void request() {
        timeIntervalService.request();
    }

    @Override
    @PutMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void update(@RequestBody TimeIntervalModel timeInterval) {
        timeIntervalService.update(timeInterval);
    }

    @Override
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(@PathVariable String id) {
        timeIntervalService.delete(id);
    }

    // TODO 404
    @PutMapping("/{timeIntervalId}/lessons/{lessonId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void updateLesson(
        @PathVariable String timeIntervalId,
        @PathVariable String lessonId,
        @RequestBody LessonModel lessonModel
    ) {
        timeIntervalService.updateLesson(timeIntervalId, lessonId, lessonModel);
    }

    // TODO 404
    @DeleteMapping("/{timeIntervalId}/lessons/{lessonId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(
        @PathVariable String timeIntervalId,
        @PathVariable String lessonId
    ) {
        timeIntervalService.deleteLesson(timeIntervalId, lessonId);
    }

    @GetMapping("/reset")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void reset() {
        timeIntervalService.resetAppliedTemplateIndex();
    }
}
