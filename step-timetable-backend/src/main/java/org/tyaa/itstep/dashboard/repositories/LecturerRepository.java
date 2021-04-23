package org.tyaa.itstep.dashboard.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import org.tyaa.itstep.dashboard.models.GroupModel;
import org.tyaa.itstep.dashboard.models.LecturerModel;

import java.math.BigInteger;

@Repository
public interface LecturerRepository extends ReactiveMongoRepository<LecturerModel, String> {
}
