package org.tyaa.itstep.dashboard.services;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.tyaa.itstep.dashboard.models.LessonModel;
import org.tyaa.itstep.dashboard.models.TimeIntervalModel;
import org.tyaa.itstep.dashboard.models.TimeIntervalTemplateModel;
import org.tyaa.itstep.dashboard.repositories.AudienceRepository;
import org.tyaa.itstep.dashboard.repositories.TimeIntervalTemplateRepository;
import org.tyaa.itstep.dashboard.services.interfaces.IReactiveServiceBase;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TimeIntervalTemplateReactiveService implements IReactiveServiceBase<TimeIntervalTemplateModel, String> {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final TimeIntervalTemplateRepository timeIntervalTemplateRepository;
    private final AudienceRepository audienceRepository;

    public TimeIntervalTemplateReactiveService(
        SimpMessagingTemplate simpMessagingTemplate,
        TimeIntervalTemplateRepository timeIntervalTemplateRepository,
        AudienceRepository audienceRepository
    ) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.timeIntervalTemplateRepository = timeIntervalTemplateRepository;
        this.audienceRepository = audienceRepository;
    }

    @Override
    public void create(TimeIntervalTemplateModel timeInterval) {

    }

    public void createLesson(Integer dayOfWeekNumber, String timeIntervalId, LessonModel lessonModel) {
        timeIntervalTemplateRepository.findTimeIntervalTemplateModelByDayOfWeekNumber(dayOfWeekNumber)
            .subscribe(timeIntervalTemplateModel -> {
                Optional<TimeIntervalModel> intervalOptional =
                    timeIntervalTemplateModel.getTimeIntervalModels().stream()
                        .filter(timeIntervalModel -> timeIntervalModel.getId().equals(timeIntervalId))
                        .findFirst();
                intervalOptional.ifPresent(
                    timeIntervalModel -> {
                        timeIntervalModel.getLessons().add(lessonModel);
                        timeIntervalTemplateRepository.save(timeIntervalTemplateModel);
                    }
                );
            });
    }

    @Override
    public void request() {
        this.notifyChanges();
    }

    @Override
    public void update(TimeIntervalTemplateModel timeInterval) {
    }

    @Override
    public void delete(String id) {}

    public Boolean updateLesson (
        Integer dayOfWeekNumber,
        String timeIntervalId,
        String lessonId,
        LessonModel lessonModel
    ) {
        boolean result = false;
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
                    timeIntervalTemplateRepository.save(timeIntervalTemplateModel);
                    this.notifyChanges();
                    result = true;
                }
            }
        }
        return result;
    }

    public Boolean deleteLesson (
        Integer dayOfWeekNumber,
        String timeIntervalId,
        String lessonId
    ) {
        boolean result = false;
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
                    timeIntervalTemplateRepository.save(timeIntervalTemplateModel);
                    this.notifyChanges();
                    result = true;
                }
            }
        }
        return result;
    }

    @Override
    public void notifyChanges () {
        List<TimeIntervalTemplateModel> templateModels =
            timeIntervalTemplateRepository.findAll()
                .collectList()
                .block();
        if (templateModels != null) {
            simpMessagingTemplate.convertAndSend(
                "/topic/templates",
                templateModels
            );
        }
    }
}
