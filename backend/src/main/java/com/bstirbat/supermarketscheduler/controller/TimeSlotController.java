package com.bstirbat.supermarketscheduler.controller;

import com.bstirbat.supermarketscheduler.entity.*;
import com.bstirbat.supermarketscheduler.exception.NotFoundException;
import com.bstirbat.supermarketscheduler.exception.UnauthorizedException;
import com.bstirbat.supermarketscheduler.exception.ValidationFailedException;
import com.bstirbat.supermarketscheduler.model.CreateMultipleTimeSlotsModel;
import com.bstirbat.supermarketscheduler.model.CreateTimeSlotModel;
import com.bstirbat.supermarketscheduler.model.ViewTimeSlotModel;
import com.bstirbat.supermarketscheduler.repository.AppointmentRepository;
import com.bstirbat.supermarketscheduler.repository.SupermarketRepository;
import com.bstirbat.supermarketscheduler.repository.TimeSlotRepository;
import com.bstirbat.supermarketscheduler.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/timeslots")
public class TimeSlotController {

    private static final Logger logger = LoggerFactory.getLogger(TimeSlotController.class);

    private TimeSlotRepository timeSlotRepository;
    private SupermarketRepository supermarketRepository;
    private AppointmentRepository appointmentRepository;
    private UserRepository userRepository;

    public TimeSlotController(TimeSlotRepository timeSlotRepository,
                              SupermarketRepository supermarketRepository,
                              AppointmentRepository appointmentRepository,
                              UserRepository userRepository) {
        this.timeSlotRepository = timeSlotRepository;
        this.supermarketRepository = supermarketRepository;
        this.appointmentRepository = appointmentRepository;
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

    @GetMapping("/supermarket/{supermarketId}")
    public List<ViewTimeSlotModel> allForSupermarket(@PathVariable Long supermarketId, OAuth2Authentication authentication) {
        User loggedInUser = null;
        if (authentication != null) {
            String username = (String) authentication.getUserAuthentication().getPrincipal();
            loggedInUser = userRepository.findByUsername(username);
        }

        final String currentUserUsername = loggedInUser == null? null: loggedInUser.getUsername();

        List<TimeSlot> timeSlots = timeSlotRepository.allForSupermarket(supermarketId);

        List<ViewTimeSlotModel> results = new ArrayList<>();
        for (TimeSlot timeSlot: timeSlots) {
            Specification<Appointment> specification = (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("timeSlot"), timeSlot);
            List<Appointment> appointments = appointmentRepository.findAll(specification);
            int nrAppointments = appointments == null? 0: appointments.size();

            Optional<Appointment> currentUserAppointment = appointments == null? Optional.empty():
                    appointments.stream()
                    .filter(a -> a.getUser().getUsername().equals(currentUserUsername))
                    .findFirst();

            ViewTimeSlotModel viewTimeSlotModel = new ViewTimeSlotModel();
            viewTimeSlotModel.setId(timeSlot.getId());
            viewTimeSlotModel.setDate(timeSlot.getDate());
            viewTimeSlotModel.setStartTime(timeSlot.getStartTime());
            viewTimeSlotModel.setStopTime(timeSlot.getStopTime());
            viewTimeSlotModel.setMaxAppointments(timeSlot.getMaxAppointments());
            viewTimeSlotModel.setNrAppointments(nrAppointments);

            if (currentUserAppointment.isPresent()) {
                Appointment appointment = currentUserAppointment.get();
                viewTimeSlotModel.setAppointmentIdForThisUser(appointment.getId());
            }

            results.add(viewTimeSlotModel);
        }

        return results;
    }

    @PostMapping
    public List<TimeSlot> create(@Valid @RequestBody CreateMultipleTimeSlotsModel createMultipleTimeSlotsModel, OAuth2Authentication authentication) {
        if (authentication == null) {
            throw new UnauthorizedException("Only manager users have this permission.");
        }

        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);

        if (user.getRole() != Role.MANAGER_USER) {
            throw new UnauthorizedException(String.format("User %s doesn't have this permission", username));
        }

        Supermarket supermarket = supermarketRepository.findById(createMultipleTimeSlotsModel.getSupermarketId())
                .orElseThrow(() -> new ValidationFailedException(String.format("Could't find supermarket with id %s", createMultipleTimeSlotsModel.getSupermarketId())));

        LocalTime startTime = createMultipleTimeSlotsModel.getStartTime();
        LocalTime stopTime = createMultipleTimeSlotsModel.getStopTime();
        List<TimeSlot> result = new ArrayList<>();

        while (startTime.isBefore(stopTime)) {

            LocalTime finishTime = startTime.plus(createMultipleTimeSlotsModel.getDurationOfAppointment(), ChronoUnit.MINUTES);

            TimeSlot timeSlot = new TimeSlot();
            timeSlot.setDate(createMultipleTimeSlotsModel.getDate());
            timeSlot.setMaxAppointments(createMultipleTimeSlotsModel.getMaxAppointments());
            timeSlot.setSupermarket(supermarket);
            timeSlot.setStartTime(startTime);
            timeSlot.setStopTime(finishTime.isBefore(stopTime)? finishTime: stopTime);

            timeSlot = timeSlotRepository.save(timeSlot);
            result.add(timeSlot);

            startTime = finishTime;
        }

        return result;
    }

    @PutMapping
    public TimeSlot update(@PathVariable Long id, @RequestBody CreateTimeSlotModel createTimeSlotModel, OAuth2Authentication authentication) {
        if (authentication == null) {
            throw new UnauthorizedException("Only manager users have this permission.");
        }

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
        if (authentication == null) {
            throw new UnauthorizedException("Only manager users have this permission.");
        }

        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);
        if (user.getRole() != Role.MANAGER_USER) {
            throw new UnauthorizedException(String.format("user %s doesn't has this permission", username));
        }

        TimeSlot timeSlot = timeSlotRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not find time slot with id %s", id)));

        timeSlotRepository.delete(timeSlot);
    }
}
