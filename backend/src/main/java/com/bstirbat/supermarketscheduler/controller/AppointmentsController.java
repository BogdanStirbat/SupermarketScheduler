package com.bstirbat.supermarketscheduler.controller;

import com.bstirbat.supermarketscheduler.entity.Appointment;
import com.bstirbat.supermarketscheduler.entity.Role;
import com.bstirbat.supermarketscheduler.entity.TimeSlot;
import com.bstirbat.supermarketscheduler.entity.User;
import com.bstirbat.supermarketscheduler.exception.NotFoundException;
import com.bstirbat.supermarketscheduler.exception.UnauthorizedException;
import com.bstirbat.supermarketscheduler.model.CreateAppointmentModel;
import com.bstirbat.supermarketscheduler.repository.AppointmentRepository;
import com.bstirbat.supermarketscheduler.repository.TimeSlotRepository;
import com.bstirbat.supermarketscheduler.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentsController {

    private AppointmentRepository appointmentRepository;
    private UserRepository userRepository;
    private TimeSlotRepository timeSlotRepository;

    public AppointmentsController(AppointmentRepository appointmentRepository, UserRepository userRepository, TimeSlotRepository timeSlotRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    @GetMapping
    public List<Appointment> all(OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);

        List<Appointment> appointments;

        if (user.getRole() == Role.MANAGER_USER) {
            appointments = (List<Appointment>) appointmentRepository.findAll();
        } else {
            Specification<Appointment> specification = (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("user"), user);
            appointments = appointmentRepository.findAll(specification);
        }

        return appointments;
    }

    @GetMapping("/{id}")
    public Appointment findById(@PathVariable Long id, OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);

        Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not find any appointment for id=%s", id)));

        if (!(user.getRole() == Role.MANAGER_USER || user.getUsername().equals(appointment.getUser().getUsername()))) {
            throw new UnauthorizedException(String.format("user %s doesn't has the permission to view this appointment", username));
        }

        return appointment;
    }

    @PostMapping
    public Appointment create(@Valid @RequestBody CreateAppointmentModel createAppointmentModel, OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);

        TimeSlot timeSlot = timeSlotRepository.findById(createAppointmentModel.getSlotId())
                .orElseThrow(() -> new NotFoundException(String.format("Could not find time slot with id %s", createAppointmentModel.getSlotId())));

        Appointment appointment = new Appointment();
        appointment.setTimeSlot(timeSlot);

        if (createAppointmentModel.getUserId() != null) {
            if (!(user.getRole() == Role.MANAGER_USER || user.getId().equals(createAppointmentModel.getUserId()))) {
                throw new UnauthorizedException(String.format("user %s doesn't has the permission to create appointments for other users", username));
            }

            User foundUser = userRepository.findById(createAppointmentModel.getUserId())
                    .orElseThrow(() -> new NotFoundException("Cannot find user with id " + createAppointmentModel.getUserId()));
            appointment.setUser(foundUser);
        } else {

            appointment.setUser(user);
        }

        return appointmentRepository.save(appointment);
    }

    @PutMapping("/{id}")
    public Appointment update(@PathVariable Long id, @RequestBody CreateAppointmentModel createAppointmentModel, OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);

        Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new NotFoundException("Could not find appointment with id=" + id));

        if (!(user.getRole() == Role.MANAGER_USER || user.getId().equals(appointment.getUser().getId()))) {
            throw new UnauthorizedException(String.format("user %s doesn't has the permission to edit this appointment", username));
        }

        if (createAppointmentModel.getSlotId() != null) {
            TimeSlot timeSlot = timeSlotRepository.findById(createAppointmentModel.getSlotId())
                    .orElseThrow(() -> new NotFoundException(String.format("Could not find time slot with id %s", createAppointmentModel.getSlotId())));
            appointment.setTimeSlot(timeSlot);
        }

        if (createAppointmentModel.getUserId() != null) {
            if (user.getRole() != Role.MANAGER_USER) {
                throw new UnauthorizedException(String.format("user %s doesn't has this permission", username));
            }

            User foundUser = userRepository.findById(createAppointmentModel.getUserId())
                    .orElseThrow(() -> new NotFoundException("Couldn't find user with id=" + createAppointmentModel.getUserId()));
            appointment.setUser(foundUser);
        }

        return appointmentRepository.save(appointment);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);

        Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new NotFoundException("Could not find appointment with id=" + id));

        if (!(user.getRole() == Role.MANAGER_USER || username.equals(appointment.getUser().getUsername()))) {
            throw new UnauthorizedException(String.format("user %s doesn't has this permission", username));
        }

        appointmentRepository.delete(appointment);
    }
}
