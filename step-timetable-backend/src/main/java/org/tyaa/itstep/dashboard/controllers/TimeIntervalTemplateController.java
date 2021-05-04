package org.tyaa.itstep.dashboard.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tyaa.itstep.dashboard.models.LessonModel;
import org.tyaa.itstep.dashboard.models.ResponseModel;
import org.tyaa.itstep.dashboard.services.TimeIntervalReactiveService;
import org.tyaa.itstep.dashboard.services.TimeIntervalTemplateService;

@RestController
@RequestMapping("/api/templates")
public class TimeIntervalTemplateController {

    final TimeIntervalTemplateService templateService;
    final TimeIntervalReactiveService timeIntervalReactiveService;

    public TimeIntervalTemplateController(
        TimeIntervalTemplateService templateService,
        TimeIntervalReactiveService timeIntervalReactiveService
    ) {
        this.templateService = templateService;
        this.timeIntervalReactiveService = timeIntervalReactiveService;
    }

    @GetMapping("/apply")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void apply () {
        timeIntervalReactiveService.resetAppliedTemplateIndex();
    }

    @PostMapping("/byDayOfWeekNumber/{dayOfWeekNumber}/intervals/{timeIntervalId}/lessons")
    public ResponseEntity<ResponseModel> createLesson(
        @PathVariable Integer dayOfWeekNumber,
        @PathVariable String timeIntervalId,
        @RequestBody LessonModel lessonModel
    ) {
        ResponseModel responseModel =
            templateService.createLesson(dayOfWeekNumber, timeIntervalId, lessonModel);
        HttpStatus httpStatus;
        if (responseModel.getStatus().equals(ResponseModel.SUCCESS_STATUS)) {
            httpStatus = HttpStatus.CREATED;
        } else {
            httpStatus = HttpStatus.NOT_FOUND;
        }
        return new ResponseEntity<>(responseModel, httpStatus);
    }

    @GetMapping("/byDayOfWeekNumber/{dayOfWeekNumber}/intervals")
    public ResponseEntity<ResponseModel> getIntervalsByDayOfWeek(@PathVariable Integer dayOfWeekNumber) {
        ResponseModel responseModel =
            templateService.getIntervalsByDayOfWeek(dayOfWeekNumber);
        HttpStatus httpStatus;
        if (responseModel.getStatus().equals(ResponseModel.SUCCESS_STATUS)) {
            httpStatus = HttpStatus.OK;
        } else {
            httpStatus = HttpStatus.NOT_FOUND;
        }
        return new ResponseEntity<>(responseModel, httpStatus);
    }

    @PutMapping("/byDayOfWeekNumber/{dayOfWeekNumber}/intervals/{timeIntervalId}/lessons/{lessonId}")
    public ResponseEntity<ResponseModel> updateLesson(
        @PathVariable Integer dayOfWeekNumber,
        @PathVariable String timeIntervalId,
        @PathVariable String lessonId,
        @RequestBody LessonModel lessonModel
    ) {
        ResponseModel responseModel =
            templateService.updateLesson(dayOfWeekNumber, timeIntervalId, lessonId, lessonModel);
        HttpStatus httpStatus;
        if (responseModel.getStatus().equals(ResponseModel.SUCCESS_STATUS)) {
            httpStatus = HttpStatus.OK;
        } else {
            httpStatus = HttpStatus.NOT_FOUND;
        }
        return new ResponseEntity<>(responseModel, httpStatus);
    }

    @DeleteMapping("/byDayOfWeekNumber/{dayOfWeekNumber}/intervals/{timeIntervalId}/lessons/{lessonId}")
    public ResponseEntity<ResponseModel> delete(
        @PathVariable Integer dayOfWeekNumber,
        @PathVariable String timeIntervalId,
        @PathVariable String lessonId
    ) {
        ResponseModel responseModel =
            templateService.deleteLesson(dayOfWeekNumber, timeIntervalId, lessonId);
        HttpStatus httpStatus;
        if (responseModel.getStatus().equals(ResponseModel.SUCCESS_STATUS)) {
            httpStatus = HttpStatus.NO_CONTENT;
        } else {
            httpStatus = HttpStatus.NOT_FOUND;
        }
        return new ResponseEntity<>(responseModel, httpStatus);
    }
}
