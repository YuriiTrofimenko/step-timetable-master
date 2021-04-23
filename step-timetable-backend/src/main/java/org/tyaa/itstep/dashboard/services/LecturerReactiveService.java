package org.tyaa.itstep.dashboard.services;

import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.tyaa.itstep.dashboard.models.LecturerModel;
import org.tyaa.itstep.dashboard.repositories.LecturerRepository;
import org.tyaa.itstep.dashboard.services.interfaces.IReactiveServiceBase;

import java.util.ArrayList;
import java.util.List;

@Service
public class LecturerReactiveService implements IReactiveServiceBase<LecturerModel, String> {

    private final LecturerRepository lecturerRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public LecturerReactiveService(LecturerRepository lecturerRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.lecturerRepository = lecturerRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void create(LecturerModel lecturer) {
        lecturerRepository.save(lecturer).subscribe(
            lecturerModel -> {},
            throwable -> {},
            this::notifyChanges
        );
    }

    @Override
    public void request() {
        this.notifyChanges();
    }

    @Override
    public void update(LecturerModel lecturer) {
        this.create(lecturer);
    }

    @Override
    public void delete(String id) {
        lecturerRepository.deleteById(id).subscribe(
            lecturerModel -> {},
            throwable -> {},
            this::notifyChanges
        );
    }

    @Override
    public void notifyChanges () {
        List<LecturerModel> lecturerModels =
            lecturerRepository.findAll(Sort.by("name"))
                .collectList()
                .block();
        if (lecturerModels == null) {
            lecturerModels = new ArrayList<>();
        }
        simpMessagingTemplate.convertAndSend(
            "/topic/lecturers",
            lecturerModels
        );
    }
}
