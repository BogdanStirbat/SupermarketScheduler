package com.bstirbat.supermarketscheduler.repository;

import com.bstirbat.supermarketscheduler.entity.TimeSlot;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TimeSlotRepository extends CrudRepository<TimeSlot, Long> {

    @Query(value = "select ts from TimeSlot ts where ts.supermarket.id=:supermarketId")
    List<TimeSlot> allForSupermarket(Long supermarketId);
}
