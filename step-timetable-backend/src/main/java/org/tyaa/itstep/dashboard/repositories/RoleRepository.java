package org.tyaa.itstep.dashboard.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.tyaa.itstep.dashboard.models.RoleModel;

import java.math.BigInteger;

@Repository
public interface RoleRepository extends MongoRepository<RoleModel, String> {
    RoleModel findRoleModelByName(String name);
}
