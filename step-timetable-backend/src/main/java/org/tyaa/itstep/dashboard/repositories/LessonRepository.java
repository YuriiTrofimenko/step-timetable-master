package org.tyaa.itstep.dashboard.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import org.tyaa.itstep.dashboard.models.LecturerModel;
import org.tyaa.itstep.dashboard.models.LessonModel;

import java.math.BigInteger;

@Repository
public interface LessonRepository extends ReactiveMongoRepository<LessonModel, String> {
}
