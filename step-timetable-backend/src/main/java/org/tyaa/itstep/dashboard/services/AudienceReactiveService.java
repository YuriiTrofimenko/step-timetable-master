package org.tyaa.itstep.dashboard.services;

import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.tyaa.itstep.dashboard.models.AudienceModel;
// import org.tyaa.itstep.dashboard.models.ResponseModel;
import org.tyaa.itstep.dashboard.repositories.AudienceRepository;
import org.tyaa.itstep.dashboard.services.interfaces.IReactiveServiceBase;
// import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;

@Service
public class AudienceReactiveService implements IReactiveServiceBase<AudienceModel, String> {

    private final AudienceRepository audienceRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public AudienceReactiveService(AudienceRepository audienceRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.audienceRepository = audienceRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void create(AudienceModel audience) {
        audienceRepository.save(audience).subscribe(
            audienceModel -> {},
            throwable -> {},
            this::notifyChanges
        );
    }

    @Override
    public void request() {
        this.notifyChanges();
    }

    /* @Override
    public ResponseModel getAll() {
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .data(
                audienceRepository.findAll(Sort.by("audienceNumber")).collectList().block()
            )
            .build();
    }

    @Override
    public Flux<AudienceModel> getAllReactive() {
        return audienceRepository.findAll(Sort.by("audienceNumber"));
    }

    @Override
    public ResponseModel get(BigInteger id) {
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .data(
                audienceRepository.findById(id).block()
            )
            .build();
    } */

    @Override
    public void update(AudienceModel audience) {
        this.create(audience);
    }

    @Override
    public void delete(String id) {
        audienceRepository.deleteById(id).subscribe(
            audienceModel -> {},
            throwable -> {},
            this::notifyChanges
        );
        /* AudienceModel audienceModel =
            audienceRepository.findById(id).block();
        if (audienceModel != null) {
            audienceRepository.deleteById(id).block();
            return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("Audience %s deleted", audienceModel.getAudienceNumber()))
                .build();
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(String.format("Audience %s not found", audienceModel.getAudienceNumber()))
                .build();
        } */
    }

    @Override
    public void notifyChanges () {
        List<AudienceModel> audienceModels =
            audienceRepository.findAll(Sort.by("audienceNumber"))
                .collectList()
                .block();
        if (audienceModels == null) {
            audienceModels = new ArrayList<>();
        }
        simpMessagingTemplate.convertAndSend(
            "/topic/audiences",
            audienceModels
        );
    }
}
