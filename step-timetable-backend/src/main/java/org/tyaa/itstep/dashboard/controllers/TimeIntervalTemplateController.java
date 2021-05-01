package org.tyaa.itstep.dashboard.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.tyaa.itstep.dashboard.models.LessonModel;
import org.tyaa.itstep.dashboard.models.TimeIntervalModel;
import org.tyaa.itstep.dashboard.models.TimeIntervalTemplateModel;
import org.tyaa.itstep.dashboard.services.TimeIntervalReactiveService;
import org.tyaa.itstep.dashboard.services.TimeIntervalTemplateReactiveService;

@RestController
@RequestMapping("/api/templates")
public class TimeIntervalTemplateController implements IRestControllerBase<TimeIntervalTemplateModel, String> {

    final TimeIntervalTemplateReactiveService templateService;

    public TimeIntervalTemplateController(TimeIntervalTemplateReactiveService templateService) {
        this.templateService = templateService;
    }

    @PostMapping("/byDayOfWeekNumber/{dayOfWeekNumber}/intervals/{timeIntervalId}/lessons")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void createLesson(
        @PathVariable Integer dayOfWeekNumber,
        @PathVariable String timeIntervalId,
        @RequestBody LessonModel lessonModel
    ) {
        templateService.createLesson(dayOfWeekNumber, timeIntervalId, lessonModel);
    }

    @Override
    public void create(TimeIntervalTemplateModel model) {
        // not implemented
    }

    @Override
    @GetMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void request() {
        templateService.request();
    }

    @Override
    public void update(TimeIntervalTemplateModel model) {
        // not implemented
    }

    @Override
    public void delete(String s) {
        // not implemented
    }

    @PutMapping("/byDayOfWeekNumber/{dayOfWeekNumber}/intervals/{timeIntervalId}/lessons/{lessonId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void updateLesson(
        @PathVariable Integer dayOfWeekNumber,
        @PathVariable String timeIntervalId,
        @PathVariable String lessonId,
        @RequestBody LessonModel lessonModel
    ) {
        templateService.updateLesson(dayOfWeekNumber, timeIntervalId, lessonId, lessonModel);
    }

    @DeleteMapping("/byDayOfWeekNumber/{dayOfWeekNumber}/intervals/{timeIntervalId}/lessons/{lessonId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(
        @PathVariable Integer dayOfWeekNumber,
        @PathVariable String timeIntervalId,
        @PathVariable String lessonId
    ) {
        templateService.deleteLesson(dayOfWeekNumber, timeIntervalId, lessonId);
    }
}
