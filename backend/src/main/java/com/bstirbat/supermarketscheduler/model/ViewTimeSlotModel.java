package com.bstirbat.supermarketscheduler.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class ViewTimeSlotModel {

    private Long id;

    private Integer maxAppointments;

    private Integer nrAppointments;

    private Long appointmentIdForThisUser;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime stopTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMaxAppointments() {
        return maxAppointments;
    }

    public void setMaxAppointments(Integer maxAppointments) {
        this.maxAppointments = maxAppointments;
    }

    public Integer getNrAppointments() {
        return nrAppointments;
    }

    public void setNrAppointments(Integer nrAppointments) {
        this.nrAppointments = nrAppointments;
    }

    public Long getAppointmentIdForThisUser() {
        return appointmentIdForThisUser;
    }

    public void setAppointmentIdForThisUser(Long appointmentIdForThisUser) {
        this.appointmentIdForThisUser = appointmentIdForThisUser;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getStopTime() {
        return stopTime;
    }

    public void setStopTime(LocalTime stopTime) {
        this.stopTime = stopTime;
    }
}
