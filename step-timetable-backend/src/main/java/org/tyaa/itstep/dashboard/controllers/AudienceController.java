package org.tyaa.itstep.dashboard.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.tyaa.itstep.dashboard.models.AudienceModel;
import org.tyaa.itstep.dashboard.services.AudienceReactiveService;

import java.math.BigInteger;

@RestController
@RequestMapping("/api/audiences")
public class AudienceController implements IRestControllerBase<AudienceModel, String> {

    final AudienceReactiveService audienceService;

    public AudienceController(AudienceReactiveService audienceService) {
        this.audienceService = audienceService;
    }

    @Override
    @PostMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void create(@RequestBody AudienceModel audience) {
        audienceService.create(audience);
    }

    @Override
    @GetMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void request() {
        audienceService.request();
    }

    @Override
    @PutMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void update(@RequestBody AudienceModel audience) {
        audienceService.update(audience);
    }

    @Override
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(@PathVariable String id) {
        audienceService.delete(id);
    }
}
