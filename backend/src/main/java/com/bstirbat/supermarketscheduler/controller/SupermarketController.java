package com.bstirbat.supermarketscheduler.controller;

import com.bstirbat.supermarketscheduler.entity.Appointment;
import com.bstirbat.supermarketscheduler.entity.Role;
import com.bstirbat.supermarketscheduler.entity.Supermarket;
import com.bstirbat.supermarketscheduler.entity.User;
import com.bstirbat.supermarketscheduler.exception.NotFoundException;
import com.bstirbat.supermarketscheduler.exception.UnauthorizedException;
import com.bstirbat.supermarketscheduler.model.CreateSupermarketModel;
import com.bstirbat.supermarketscheduler.model.ViewAppointmentModel;
import com.bstirbat.supermarketscheduler.model.ViewSupermarketModel;
import com.bstirbat.supermarketscheduler.repository.AppointmentRepository;
import com.bstirbat.supermarketscheduler.repository.SupermarketRepository;
import com.bstirbat.supermarketscheduler.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/supermarkets")
public class SupermarketController {

    private AppointmentRepository appointmentRepository;
    private SupermarketRepository supermarketRepository;
    private UserRepository userRepository;

    public SupermarketController(AppointmentRepository appointmentRepository, SupermarketRepository supermarketRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.supermarketRepository = supermarketRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Supermarket> all(OAuth2Authentication authentication) {

        return (List<Supermarket>) supermarketRepository.findAll();
    }

    @GetMapping("/{id}")
    public Supermarket findById(@PathVariable Long id, OAuth2Authentication authentication) {

        Supermarket supermarket = supermarketRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not found a supermarket with id %s", id)));

        return supermarket;
    }

    @GetMapping("/all-appointments")
    public List<ViewSupermarketModel> findAllAppointments(OAuth2Authentication authentication) {
        if (authentication == null) {
            throw new UnauthorizedException(String.format("Only manager users have this permission."));
        }

        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);

        Specification<Appointment> specification = (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("user"), user);
        List<Appointment> appointments = appointmentRepository.findAll(specification);

        if (appointments == null || appointments.isEmpty()) {
            return new ArrayList<>();
        }

        Map<Long, List<Appointment>> supermarketToAppointments = new HashMap<>();
        for (Appointment appointment: appointments) {
            Long supermarketId = appointment.getTimeSlot().getSupermarket().getId();
            if (!supermarketToAppointments.containsKey(supermarketId)) {
                supermarketToAppointments.put(supermarketId, new ArrayList<>());
            }
            supermarketToAppointments.get(supermarketId).add(appointment);
        }

        List<ViewSupermarketModel> result = new ArrayList<>();

        for (Long supermarketId : supermarketToAppointments.keySet()) {
            Supermarket supermarket = supermarketRepository.findById(supermarketId)
                    .orElseThrow(() -> new NotFoundException(String.format("Could not found a supermarket with id %s", supermarketId)));

            List<ViewAppointmentModel> viewAppointmentModels = supermarketToAppointments.get(supermarketId).stream()
                    .map(a -> {
                        ViewAppointmentModel model = new ViewAppointmentModel();
                        model.setId(a.getId());
                        model.setDate(a.getTimeSlot().getDate());
                        model.setStartTime(a.getTimeSlot().getStartTime());
                        model.setStopTime(a.getTimeSlot().getStopTime());
                        return model;
                    })
                    .collect(Collectors.toList());

            ViewSupermarketModel viewSupermarketModel = new ViewSupermarketModel();
            viewSupermarketModel.setId(supermarket.getId());
            viewSupermarketModel.setName(supermarket.getName());
            viewSupermarketModel.setAddress(supermarket.getAddress());
            viewSupermarketModel.setAppointments(viewAppointmentModels);

            result.add(viewSupermarketModel);
        }

        return result;
    }

    @PostMapping
    public Supermarket create(@Valid @RequestBody CreateSupermarketModel createSupermarketModel, OAuth2Authentication authentication) {
        if (authentication == null) {
            throw new UnauthorizedException(String.format("Only manager users have this permission."));
        }

        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);
        if (user.getRole() != Role.MANAGER_USER) {
            throw new UnauthorizedException(String.format("User %s doesn't has this permission.", username));
        }

        Supermarket supermarket = new Supermarket();
        supermarket.setName(createSupermarketModel.getName());
        supermarket.setAddress(createSupermarketModel.getAddress());

        return supermarketRepository.save(supermarket);
    }

    @PutMapping("/{id}")
    public Supermarket update(@PathVariable Long id, @RequestBody CreateSupermarketModel createSupermarketModel, OAuth2Authentication authentication) {
        if (authentication == null) {
            throw new UnauthorizedException(String.format("Only manager users have this permission."));
        }

        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);
        if (user.getRole() != Role.MANAGER_USER) {
            throw new UnauthorizedException(String.format("User %s doesn't has this permission.", username));
        }

        Supermarket supermarket = supermarketRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not found a supermarket with id %s", id)));

        if (!StringUtils.isEmpty(createSupermarketModel.getName())) {
            supermarket.setName(createSupermarketModel.getName());
        }
        if (!StringUtils.isEmpty(createSupermarketModel.getAddress())) {
            supermarket.setAddress(createSupermarketModel.getAddress());
        }

        return supermarketRepository.save(supermarket);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, OAuth2Authentication authentication) {
        if (authentication == null) {
            throw new UnauthorizedException(String.format("Only manager users have this permission."));
        }

        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);
        if (user.getRole() != Role.MANAGER_USER) {
            throw new UnauthorizedException(String.format("User %s doesn't has this permission.", username));
        }

        Supermarket supermarket = supermarketRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not found a supermarket with id %s", id)));

        supermarketRepository.delete(supermarket);
    }
}
