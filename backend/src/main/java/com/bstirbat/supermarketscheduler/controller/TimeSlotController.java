package com.bstirbat.supermarketscheduler.controller;

import com.bstirbat.supermarketscheduler.entity.Role;
import com.bstirbat.supermarketscheduler.entity.Supermarket;
import com.bstirbat.supermarketscheduler.entity.TimeSlot;
import com.bstirbat.supermarketscheduler.entity.User;
import com.bstirbat.supermarketscheduler.exception.NotFoundException;
import com.bstirbat.supermarketscheduler.exception.UnauthorizedException;
import com.bstirbat.supermarketscheduler.exception.ValidationFailedException;
import com.bstirbat.supermarketscheduler.model.CreateTimeSlotModel;
import com.bstirbat.supermarketscheduler.repository.SupermarketRepository;
import com.bstirbat.supermarketscheduler.repository.TimeSlotRepository;
import com.bstirbat.supermarketscheduler.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/timeslots")
public class TimeSlotController {

    private TimeSlotRepository timeSlotRepository;
    private SupermarketRepository supermarketRepository;
    private UserRepository userRepository;

    public TimeSlotController(TimeSlotRepository timeSlotRepository, SupermarketRepository supermarketRepository, UserRepository userRepository) {
        this.timeSlotRepository = timeSlotRepository;
        this.supermarketRepository = supermarketRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<TimeSlot> all(OAuth2Authentication authentication) {

        return (List<TimeSlot>) timeSlotRepository.findAll();
    }

    @GetMapping("/{id}")
    public TimeSlot findById(@PathVariable Long id, OAuth2Authentication authentication) {

        TimeSlot timeSlot = timeSlotRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not find time slot with id %s", id)));

        return timeSlot;
    }

    @PostMapping
    public TimeSlot create(@Valid @RequestBody CreateTimeSlotModel createTimeSlotModel, OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);

        if (user.getRole() != Role.MANAGER_USER) {
            throw new UnauthorizedException(String.format("User %s doesn't have this permission", username));
        }

        Supermarket supermarket = supermarketRepository.findById(createTimeSlotModel.getSupermarketId())
                .orElseThrow(() -> new ValidationFailedException(String.format("Could't find supermarket with id %s", createTimeSlotModel.getSupermarketId())));

        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setMaxAppointments(createTimeSlotModel.getMaxAppointments());
        timeSlot.setDate(createTimeSlotModel.getDate());
        timeSlot.setStartTime(createTimeSlotModel.getStartTime());
        timeSlot.setStopTime(createTimeSlotModel.getStopTime());
        timeSlot.setSupermarket(supermarket);

        return timeSlotRepository.save(timeSlot);
    }

    @PutMapping
    public TimeSlot update(@PathVariable Long id, @RequestBody CreateTimeSlotModel createTimeSlotModel, OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);

        if (user.getRole() != Role.MANAGER_USER) {
            throw new UnauthorizedException(String.format("User %s doesn't have this permission", username));
        }

        TimeSlot timeSlot = timeSlotRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not find time slot with id %s", id)));

        if (createTimeSlotModel.getMaxAppointments() != null) {
            timeSlot.setMaxAppointments(createTimeSlotModel.getMaxAppointments());
        }
        if (createTimeSlotModel.getDate() != null) {
            timeSlot.setDate(createTimeSlotModel.getDate());
        }
        if (createTimeSlotModel.getStartTime() != null) {
            timeSlot.setStartTime(createTimeSlotModel.getStartTime());
        }
        if (createTimeSlotModel.getStopTime() != null) {
            timeSlot.setStopTime(createTimeSlotModel.getStopTime());
        }
        if (createTimeSlotModel.getSupermarketId() != null) {
            Supermarket supermarket = supermarketRepository.findById(createTimeSlotModel.getSupermarketId())
                    .orElseThrow(() -> new ValidationFailedException(String.format("Could't find supermarket with id %s", createTimeSlotModel.getSupermarketId())));
            timeSlot.setSupermarket(supermarket);
        }

        return timeSlotRepository.save(timeSlot);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);
        if (user.getRole() != Role.MANAGER_USER) {
            throw new UnauthorizedException(String.format("user %s doesn't has this permission", username));
        }

        TimeSlot timeSlot = timeSlotRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not find time slot with id %s", id)));

        timeSlotRepository.delete(timeSlot);
    }
}
