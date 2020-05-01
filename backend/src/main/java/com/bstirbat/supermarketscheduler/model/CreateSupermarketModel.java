package com.bstirbat.supermarketscheduler.model;

import javax.validation.constraints.NotBlank;

public class CreateSupermarketModel {

    @NotBlank
    private String name;

    @NotBlank
    private String address;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
