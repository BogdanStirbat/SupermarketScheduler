package com.bstirbat.supermarketscheduler.model;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class CreateMultipleTimeSlotsModel {

    @NotNull
    private Integer maxAppointments;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime stopTime;

    @NotNull
    private Long supermarketId;

    @NotNull
    private Integer durationOfAppointment;

    public Integer getMaxAppointments() {
        return maxAppointments;
    }

    public void setMaxAppointments(Integer maxAppointments) {
        this.maxAppointments = maxAppointments;
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

    public Long getSupermarketId() {
        return supermarketId;
    }

    public void setSupermarketId(Long supermarketId) {
        this.supermarketId = supermarketId;
    }

    public Integer getDurationOfAppointment() {
        return durationOfAppointment;
    }

    public void setDurationOfAppointment(Integer durationOfAppointment) {
        this.durationOfAppointment = durationOfAppointment;
    }

    @Override
    public String toString() {
        return "CreateMultipleTimeSlotsModel{" +
                "maxAppointments=" + maxAppointments +
                ", date=" + date +
                ", startTime=" + startTime +
                ", stopTime=" + stopTime +
                ", supermarketId=" + supermarketId +
                ", durationOfAppointment=" + durationOfAppointment +
                '}';
    }
}
