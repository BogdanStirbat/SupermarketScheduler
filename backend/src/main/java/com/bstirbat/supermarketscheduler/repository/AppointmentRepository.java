package com.bstirbat.supermarketscheduler.repository;

import com.bstirbat.supermarketscheduler.entity.Appointment;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

public interface AppointmentRepository extends CrudRepository<Appointment, Long>, JpaSpecificationExecutor<Appointment> {
}
