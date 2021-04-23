package org.tyaa.itstep.dashboard.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import org.tyaa.itstep.dashboard.models.LessonModel;
import org.tyaa.itstep.dashboard.models.TimeIntervalModel;

import java.math.BigInteger;

@Repository
public interface TimeIntervalRepository extends ReactiveMongoRepository<TimeIntervalModel, String> {
}
