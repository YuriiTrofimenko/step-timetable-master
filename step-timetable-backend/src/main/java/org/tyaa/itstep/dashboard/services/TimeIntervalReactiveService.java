package org.tyaa.itstep.dashboard.services;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.tyaa.itstep.dashboard.models.LessonModel;
import org.tyaa.itstep.dashboard.models.TimeIntervalModel;
import org.tyaa.itstep.dashboard.models.TimeIntervalModel;
import org.tyaa.itstep.dashboard.repositories.AudienceRepository;
import org.tyaa.itstep.dashboard.repositories.LessonRepository;
import org.tyaa.itstep.dashboard.repositories.TimeIntervalRepository;
import org.tyaa.itstep.dashboard.repositories.TimeIntervalTemplateRepository;
import org.tyaa.itstep.dashboard.services.interfaces.IReactiveServiceBase;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

// import org.tyaa.itstep.dashboard.models.ResponseModel;
// import reactor.core.publisher.Flux;

@Service
public class TimeIntervalReactiveService implements IReactiveServiceBase<TimeIntervalModel, String> {

    private static Integer appliedTemplateIndex = null;
    public static List<TimeIntervalModel> timeIntervalList = new ArrayList<>();

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final TimeIntervalTemplateRepository timeIntervalTemplateRepository;
    private final AudienceRepository audienceRepository;
    // private final LessonRepository lessonRepository;
    // private boolean timeIntervalTemplateNeedsUpdate = false;

    public TimeIntervalReactiveService(
        SimpMessagingTemplate simpMessagingTemplate,
        TimeIntervalTemplateRepository timeIntervalTemplateRepository,
        AudienceRepository audienceRepository// ,
        // LessonRepository lessonRepository
    ) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.timeIntervalTemplateRepository = timeIntervalTemplateRepository;
        this.audienceRepository = audienceRepository;
        // this.lessonRepository = lessonRepository;
    }

    @Override
    public void create(TimeIntervalModel timeInterval) {
        /* timeIntervalRepository.save(timeInterval).subscribe(
            timeIntervalModel -> {},
            throwable -> {},
            this::notifyChanges
        ); */
    }

    @Override
    public void request() {
        this.notifyChanges();
    }

    @Override
    public void update(TimeIntervalModel timeInterval) {
        // this.create(timeInterval);
    }

    @Override
    public void delete(String id) {
        /* timeIntervalRepository.deleteById(id).subscribe(
            timeIntervalModel -> {},
            throwable -> {},
            this::notifyChanges
        ); */
    }

    public Boolean updateLesson(String timeIntervalId, String lessonId, LessonModel lessonModel) {
        Boolean result = false;
        Optional<TimeIntervalModel> timeIntervalModelOptional =
            timeIntervalList.stream().filter(
                timeIntervalModel -> timeIntervalModel.getId().equals(timeIntervalId)
            ).findFirst();
        // System.out.println("timeIntervalId = " + timeIntervalId);
        if (timeIntervalModelOptional.isPresent()) {
            System.out.println("getLessons -> " + timeIntervalModelOptional.get().getLessons().size());
            Optional<LessonModel> lessonModelOptional =
                timeIntervalModelOptional.get().getLessons().stream()
                    .filter(
                        currentLessonModel -> {
                            // System.out.println("currentLessonModel.getId() -> " + currentLessonModel.getId());
                            // System.out.println("lessonId -> " + lessonId);
                            return currentLessonModel.getId().equals(lessonId);
                        }
                    ).findFirst();
            // System.out.println("lessonId = " + lessonId);
            if (lessonModelOptional.isPresent()) {
                // lessonRepository.save(lessonModel).block();
                LessonModel lesson = lessonModelOptional.get();
                lesson.setGroupId(lessonModel.getGroupId());
                lesson.setLecturerId(lessonModel.getLecturerId());
                // System.out.println("lessonModel = " + lessonModel);
                this.notifyChanges();
                result = true;
            }
        }
        // System.out.println("result = " + result);
        return result;
    }

    public Boolean deleteLesson(String timeIntervalId, String lessonId) {
        Boolean result = false;
        Optional<TimeIntervalModel> timeIntervalModelOptional =
            timeIntervalList.stream().filter(
                timeIntervalModel -> timeIntervalModel.getId().equals(timeIntervalId)
            ).findFirst();
        if (timeIntervalModelOptional.isPresent()) {
            Optional<LessonModel> lessonModelOptional =
                timeIntervalModelOptional.get().getLessons().stream()
                    .filter(
                        lessonModel -> lessonModel.getId().equals(lessonId)
                    ).findFirst();
            if (lessonModelOptional.isPresent()) {
                // lessonRepository.deleteById(lessonId).block();
                timeIntervalModelOptional.get().getLessons().remove(lessonModelOptional.get());
                this.notifyChanges();
                result = true;
            }
        }
        return result;
    }

    @Override
    public void notifyChanges () {
        /* List<TimeIntervalModel> timeIntervalModels =
            timeIntervalRepository.findAll(Sort.by("timeIntervalNumber"))
                .collectList()
                .block();
        if (timeIntervalModels == null) {
            timeIntervalModels = new ArrayList<>();
        }
        simpMessagingTemplate.convertAndSend(
            "/topic/intervals",
            timeIntervalModels
        ); */
        // System.out.println("*** getPairNumber ***");
        /* System.out.println("timeIntervalList = " + timeIntervalList.size());
        timeIntervalList.forEach(timeIntervalModel -> {
            System.out.println(timeIntervalModel.getPairNumber());
            timeIntervalModel.getLessons().forEach(System.out::println);
            System.out.println("***");
        }); */
        simpMessagingTemplate.convertAndSend(
            "/topic/intervals",
            timeIntervalList
        );
    }

    public void sendTimeStamp (Long milliseconds) {
        simpMessagingTemplate.convertAndSend(
            "/topic/timestamp",
            milliseconds
        );
    }

    public void resetAppliedTemplateIndex () {
        appliedTemplateIndex = null;
    }

    public void reviseTimeIntervals () {
        Date currentDate = new Date();
        // System.out.println("appliedTemplateIndex = " + appliedTemplateIndex);
        // System.out.println("currentDate.getDay() = " + currentDate.getDay());
        // System.out.println("currentDate.getHours() = " + currentDate.getHours());
        // System.out.println(" *** ");
        // this.sendTimeStamp(currentDate.getTime());
        if (appliedTemplateIndex == null && currentDate.getHours() >= 8 && currentDate.getHours() < 23) {
            if (currentDate.getDay() > 0) {
                // If Not Sunday [1; 6] -> [1; 6]
                appliedTemplateIndex = currentDate.getDay();
            } else {
                // If Sunday 0 -> 7
                appliedTemplateIndex = 7;
            }
            timeIntervalTemplateRepository
                .findTimeIntervalTemplateModelByDayOfWeekNumber(appliedTemplateIndex)
                .subscribe(
                    timeIntervalTemplateModel -> {
                        List<TimeIntervalModel> timeIntervalList =
                            timeIntervalTemplateModel.getTimeIntervalModels();
                        // System.out.println("timeIntervalList = " + timeIntervalList.size());
                        timeIntervalList.forEach(
                                timeIntervalModel -> {
                                    audienceRepository.findAll().subscribe(
                                        audienceModel -> {
                                            Optional<LessonModel> lessonModelOptional =
                                                timeIntervalModel.getLessons().stream()
                                                    .filter(
                                                        lessonModel -> lessonModel.getAudienceNumber().equals(audienceModel.getAudienceNumber())
                                                    ).findFirst();
                                            /* System.out.println("lessonModelOptional = " + lessonModelOptional.isPresent());
                                            if (lessonModelOptional.isPresent()) {
                                                System.out.println("lessonModel = " + lessonModelOptional.get());
                                            } */
                                            if (!lessonModelOptional.isPresent()) {
                                                timeIntervalModel.getLessons().add(
                                                    LessonModel.builder()
                                                        .id(ObjectId.get().toString())
                                                        .audienceNumber(audienceModel.getAudienceNumber())
                                                        .build()
                                                );
                                                // timeIntervalTemplateNeedsUpdate = true;
                                            }
                                        }
                                    );
                                }
                            );
                        this.timeIntervalList.clear();
                        this.timeIntervalList.addAll(timeIntervalList);
                        /* if (timeIntervalTemplateNeedsUpdate) {
                            timeIntervalTemplateRepository.save(timeIntervalTemplateModel);
                            timeIntervalTemplateNeedsUpdate = false;
                        } */
                        this.notifyChanges();
                    });
        } else if (
            appliedTemplateIndex != null
                && (currentDate.getHours() < 8 || currentDate.getHours() >= 23)
        ) {
            appliedTemplateIndex = null;
            timeIntervalList.clear();
            this.notifyChanges();
        }
    }
}
