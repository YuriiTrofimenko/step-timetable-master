package org.tyaa.itstep.dashboard.services;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.tyaa.itstep.dashboard.models.LessonModel;
import org.tyaa.itstep.dashboard.repositories.LessonRepository;
import org.tyaa.itstep.dashboard.services.interfaces.IReactiveServiceBase;

import java.util.ArrayList;
import java.util.List;

@Service
public class LessonReactiveService implements IReactiveServiceBase<LessonModel, String> {

    private final LessonRepository lessonRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public LessonReactiveService(LessonRepository lessonRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.lessonRepository = lessonRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void create(LessonModel lesson) {
        lessonRepository.save(lesson).subscribe(
            lessonModel -> {},
            throwable -> {},
            this::notifyChanges
        );
    }

    @Override
    public void request() {
        this.notifyChanges();
    }

    @Override
    public void update(LessonModel lesson) {
        this.create(lesson);
    }

    @Override
    public void delete(String id) {
        lessonRepository.deleteById(id).subscribe(
            lessonModel -> {},
            throwable -> {},
            this::notifyChanges
        );
    }

    @Override
    public void notifyChanges () {
        List<LessonModel> lessonModels =
            lessonRepository.findAll()
                .collectList()
                .block();
        if (lessonModels == null) {
            lessonModels = new ArrayList<>();
        }
        simpMessagingTemplate.convertAndSend(
            "/topic/lessons",
            lessonModels
        );
    }
}
