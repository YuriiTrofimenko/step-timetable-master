package org.tyaa.itstep.dashboard.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.tyaa.itstep.dashboard.models.UserModel;
import reactor.core.publisher.Mono;

import java.math.BigInteger;
import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<UserModel, String> {
    UserModel findUserModelByName(String name);
    List<UserModel> findUserModelsByRoleId(String id);
}
