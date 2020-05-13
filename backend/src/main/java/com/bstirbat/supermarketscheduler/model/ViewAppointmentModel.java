package com.bstirbat.supermarketscheduler.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class ViewAppointmentModel {
    private Long id;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime stopTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
