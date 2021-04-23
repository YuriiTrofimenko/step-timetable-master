package org.tyaa.itstep.dashboard.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigInteger;

@Data
// @Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document
public class UserModel {
    @Id
    private String id;
    private String name;
    private String password;
    private String roleId;
    @Transient
    @JsonSerialize
    @JsonDeserialize
    private String roleName;

    // for creation
    public UserModel(String name, String password, String roleId, Boolean isNew) {
        this.name = name;
        this.password = password;
        this.roleId = roleId;
    }

    // for reading
    @PersistenceConstructor
    public UserModel(String id, String name, String roleId) {
        this.id = id;
        this.name = name;
        this.roleId = roleId;
    }

    // for
    public UserModel(String name, String roleName) {
        this.name = name;
        this.roleName = roleName;
    }
}
