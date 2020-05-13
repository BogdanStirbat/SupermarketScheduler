package com.bstirbat.supermarketscheduler.model;

import java.util.List;

public class ViewSupermarketModel {

    private Long id;
    private String name;
    private String address;
    private List<ViewAppointmentModel> appointments;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public List<ViewAppointmentModel> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<ViewAppointmentModel> appointments) {
        this.appointments = appointments;
    }
}
