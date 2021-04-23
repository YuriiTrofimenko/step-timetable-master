package org.tyaa.itstep.dashboard.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import org.tyaa.itstep.dashboard.models.AudienceModel;
import org.tyaa.itstep.dashboard.models.UserModel;

import java.math.BigInteger;

@Repository
public interface AudienceRepository extends ReactiveMongoRepository<AudienceModel, String> {
}
