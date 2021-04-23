package org.tyaa.itstep.dashboard.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.tyaa.itstep.dashboard.models.ResponseModel;
import org.tyaa.itstep.dashboard.models.RoleModel;
import org.tyaa.itstep.dashboard.models.UserModel;
import org.tyaa.itstep.dashboard.repositories.RoleRepository;
import org.tyaa.itstep.dashboard.repositories.UserRepository;
import org.tyaa.itstep.dashboard.services.interfaces.IAuthService;

// import javax.transaction.Transactional;
import java.math.BigInteger;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService implements IAuthService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ResponseModel getRoles() {
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message("All the roles fetched successfully")
            .data(
                roleRepository.findAll()
                    .stream()
                    .map(
                        roleEntity -> RoleModel.builder()
                            .id(roleEntity.getId())
                            .name(roleEntity.getName())
                            .build()
                    ).collect(Collectors.toList())
            )
            .build();
    }

    @Override
    public ResponseModel createRole(RoleModel roleModel) {
        roleRepository.save(roleModel);
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message(String.format("Role %s created", roleModel.getName()))
            .build();
    }

    @Override
    public ResponseModel createUser(UserModel userModel) {
        UserModel user =
            new UserModel(
                userModel.getName().trim(),
                passwordEncoder.encode(userModel.getPassword()),
                roleRepository.findRoleModelByName("ROLE_USER").getId()
            );
        userRepository.save(user);
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message(String.format("User %s created", user.getName()))
            .build();
    }

    @Override
    // @Transactional
    public ResponseModel getRoleUsers(String roleId) {
        Optional<RoleModel> roleOptional = roleRepository.findById(roleId);
        if (roleOptional.isPresent()) {
            RoleModel role = roleOptional.get();
            List<UserModel> userModels =
                userRepository.findUserModelsByRoleId(roleId)
                    .stream().map(user ->
                    new UserModel(
                        user.getName(),
                        role.getName()
                    )
                ).collect(Collectors.toList());
            return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("List of %s Role Users Retrieved Successfully", role.getName()))
                .data(userModels)
                .build();
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(String.format("No Users: Role #%d Not Found", roleId))
                .build();
        }
    }

    public ResponseModel deleteUser(String id) {
        userRepository.deleteById(id);
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message(String.format("User #%d Deleted", id))
            .build();
    }

    public ResponseModel makeUserAdmin(String id) throws Exception {
        RoleModel role = roleRepository.findRoleModelByName("ROLE_ADMIN");
        Optional<UserModel> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            UserModel user = userOptional.get();
            user.setRoleId(role.getId());
            userRepository.save(user);
            return ResponseModel.builder()
                .status(ResponseModel.SUCCESS_STATUS)
                .message(String.format("Admin %s created successfully", user.getName()))
                .build();
        } else {
            return ResponseModel.builder()
                .status(ResponseModel.FAIL_STATUS)
                .message(String.format("User #%d Not Found", id))
                .build();
        }
    }

    public ResponseModel check(Authentication authentication) {
        ResponseModel response = new ResponseModel();
        if (authentication != null && authentication.isAuthenticated()) {
            UserModel userModel = new UserModel(
                authentication.getName(),
                authentication.getAuthorities().stream()
                    .findFirst()
                    .get()
                    .getAuthority()
            );
            response.setStatus(ResponseModel.SUCCESS_STATUS);
            response.setMessage(String.format("User %s Signed In", userModel.getName()));
            response.setData(userModel);
        } else {
            response.setStatus(ResponseModel.SUCCESS_STATUS);
            response.setMessage("User is a Guest");
        }
        return response;
    }

    public ResponseModel onSignOut() {
        return ResponseModel.builder()
            .status(ResponseModel.SUCCESS_STATUS)
            .message("Signed out")
            .build();
    }

    public ResponseModel onError() {
        return ResponseModel.builder()
            .status(ResponseModel.FAIL_STATUS)
            .message("Auth error")
            .build();
    }
}
