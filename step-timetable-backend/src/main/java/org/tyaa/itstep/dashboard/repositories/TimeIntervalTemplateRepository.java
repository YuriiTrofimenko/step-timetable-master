package org.tyaa.itstep.dashboard.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import org.tyaa.itstep.dashboard.models.TimeIntervalTemplateModel;
import reactor.core.publisher.Mono;

import java.math.BigInteger;

@Repository
public interface TimeIntervalTemplateRepository extends ReactiveMongoRepository<TimeIntervalTemplateModel, String> {
    Mono<TimeIntervalTemplateModel> findTimeIntervalTemplateModelByDayOfWeekNumber(Integer dayOfWeekNumber);
}
