package org.tyaa.itstep.dashboard.services.interfaces;

import org.springframework.security.core.Authentication;
import org.tyaa.itstep.dashboard.models.ResponseModel;
import org.tyaa.itstep.dashboard.models.RoleModel;
import org.tyaa.itstep.dashboard.models.UserModel;

public interface IAuthService {
    ResponseModel getRoles();
    ResponseModel createRole(RoleModel roleModel);
    ResponseModel getRoleUsers(String roleId);
    ResponseModel createUser(UserModel userModel);
    ResponseModel deleteUser(String id);
    ResponseModel makeUserAdmin(String id) throws Exception;
    ResponseModel check(Authentication authentication);
    ResponseModel onSignOut();
    ResponseModel onError();
}
