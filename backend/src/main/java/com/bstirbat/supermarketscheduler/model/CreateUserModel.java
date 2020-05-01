package com.bstirbat.supermarketscheduler.model;

import com.bstirbat.supermarketscheduler.entity.Role;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class CreateUserModel {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotNull
    private Role role;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}