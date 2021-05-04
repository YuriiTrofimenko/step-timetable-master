package org.tyaa.itstep.dashboard.services;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.tyaa.itstep.dashboard.models.LessonModel;
import org.tyaa.itstep.dashboard.models.ResponseModel;
import org.tyaa.itstep.dashboard.models.TimeIntervalModel;
import org.tyaa.itstep.dashboard.models.TimeIntervalTemplateModel;
import org.tyaa.itstep.dashboard.repositories.AudienceRepository;
import org.tyaa.itstep.dashboard.repositories.TimeIntervalTemplateRepository;
import org.tyaa.itstep.dashboard.services.interfaces.IReactiveServiceBase;
import org.tyaa.itstep.dashboard.utils.Utf8Encoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TimeIntervalTemplateService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final TimeIntervalTemplateRepository timeIntervalTemplateRepository;
    private final AudienceRepository audienceRepository;

    public TimeIntervalTemplateService(
        SimpMessagingTemplate simpMessagingTemplate,
        TimeIntervalTemplateRepository timeIntervalTemplateRepository,
        AudienceRepository audienceRepository
    ) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.timeIntervalTemplateRepository = timeIntervalTemplateRepository;
        this.audienceRepository = audienceRepository;
    }

    public ResponseModel createLesson (
        Integer dayOfWeekNumber,
        String timeIntervalId,
        LessonModel lessonModel
    ) {
        TimeIntervalTemplateModel timeIntervalTemplateModel =
            timeIntervalTemplateRepository
                .findTimeIntervalTemplateModelByDayOfWeekNumber(dayOfWeekNumber)
                .block();
        if (timeIntervalTemplateModel != null) {
            Optional<TimeIntervalModel> intervalOptional =
                timeIntervalTemplateModel.getTimeIntervalModels().stream()
                    .filter(timeIntervalModel -> timeIntervalModel.getId().equals(timeIntervalId))
                    .findFirst();
            if (intervalOptional.isPresent()) {
                intervalOptional.get().getLessons().add(lessonModel);
                timeIntervalTemplateRepository.save(timeIntervalTemplateModel).block();
                return ResponseModel.builder()
                    .status(ResponseModel.FAIL_STATUS)
                    .message(Utf8Encoder.encode("Урок добавлен"))
                    .build();
            } else {
                return ResponseModel.builder()
                    .status(ResponseModel.FAIL_STATUS)
                    .message(Utf8Encoder.encode("ВременнАя полоса не найдена"))
                    .build();
            }
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(
                    Utf8Encoder.encode(
                        String.format("Шаблон для %d дня недели не найден", dayOfWeekNumber)
                    )
                )
                .build();
        }
    }

    public ResponseModel getIntervalsByDayOfWeek (Integer dayOfWeekNumber) {
        TimeIntervalTemplateModel template =
            timeIntervalTemplateRepository
                .findTimeIntervalTemplateModelByDayOfWeekNumber(dayOfWeekNumber)
                .block();
        if (template != null) {
            return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .data(template.getTimeIntervalModels())
                .build();
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(
                    Utf8Encoder.encode(
                        String.format("Template for %d day not found", dayOfWeekNumber)
                    )
                )
                .build();
        }
    }

    public ResponseModel updateLesson (
        Integer dayOfWeekNumber,
        String timeIntervalId,
        String lessonId,
        LessonModel lessonModel
    ) {
        ResponseModel responseModel =
            ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(Utf8Encoder.encode("Урок не найден"))
                .build();
        TimeIntervalTemplateModel timeIntervalTemplateModel =
            timeIntervalTemplateRepository
                .findTimeIntervalTemplateModelByDayOfWeekNumber(dayOfWeekNumber)
                .block();
        if (timeIntervalTemplateModel != null) {
            Optional<TimeIntervalModel> intervalOptional =
                timeIntervalTemplateModel.getTimeIntervalModels().stream()
                    .filter(timeIntervalModel -> timeIntervalModel.getId().equals(timeIntervalId))
                    .findFirst();
            if (intervalOptional.isPresent()) {
                Optional<LessonModel> lessonModelOptional =
                    intervalOptional.get().getLessons().stream()
                        .filter(
                            currentLessonModel -> currentLessonModel.getId().equals(lessonId)
                        ).findFirst();
                if (lessonModelOptional.isPresent()) {
                    LessonModel lesson = lessonModelOptional.get();
                    lesson.setGroupId(lessonModel.getGroupId());
                    lesson.setLecturerId(lessonModel.getLecturerId());
                    timeIntervalTemplateRepository.save(timeIntervalTemplateModel).block();
                    responseModel = ResponseModel.builder()
                        .status(ResponseModel.SUCCESS_STATUS)
                        .message(Utf8Encoder.encode("Урок обновлен"))
                        .build();
                }
            }
        }
        return responseModel;
    }

    public ResponseModel deleteLesson (
        Integer dayOfWeekNumber,
        String timeIntervalId,
        String lessonId
    ) {
        ResponseModel responseModel =
            ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(Utf8Encoder.encode("Урок не найден"))
                .build();
        TimeIntervalTemplateModel timeIntervalTemplateModel =
            timeIntervalTemplateRepository
                .findTimeIntervalTemplateModelByDayOfWeekNumber(dayOfWeekNumber)
                .block();
        if (timeIntervalTemplateModel != null) {
            Optional<TimeIntervalModel> intervalOptional =
                timeIntervalTemplateModel.getTimeIntervalModels().stream()
                    .filter(timeIntervalModel -> timeIntervalModel.getId().equals(timeIntervalId))
                    .findFirst();
            if (intervalOptional.isPresent()) {
                Optional<LessonModel> lessonModelOptional =
                    intervalOptional.get().getLessons().stream()
                        .filter(
                            lessonModel -> lessonModel.getId().equals(lessonId)
                        ).findFirst();
                if (lessonModelOptional.isPresent()) {
                    intervalOptional.get().getLessons().remove(lessonModelOptional.get());
                    timeIntervalTemplateRepository.save(timeIntervalTemplateModel).block();
                    responseModel = ResponseModel.builder()
                        .status(ResponseModel.SUCCESS_STATUS)
                        .message(Utf8Encoder.encode("Урок удален"))
                        .build();
                }
            }
        }
        return responseModel;
    }
}
