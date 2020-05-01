package com.bstirbat.supermarketscheduler.controller;

import com.bstirbat.supermarketscheduler.entity.Role;
import com.bstirbat.supermarketscheduler.entity.Supermarket;
import com.bstirbat.supermarketscheduler.entity.User;
import com.bstirbat.supermarketscheduler.exception.NotFoundException;
import com.bstirbat.supermarketscheduler.exception.UnauthorizedException;
import com.bstirbat.supermarketscheduler.model.CreateSupermarketModel;
import com.bstirbat.supermarketscheduler.repository.SupermarketRepository;
import com.bstirbat.supermarketscheduler.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/supermarkets")
public class SupermarketController {

    private SupermarketRepository supermarketRepository;
    private UserRepository userRepository;

    public SupermarketController(SupermarketRepository supermarketRepository, UserRepository userRepository) {
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

    @PostMapping
    public Supermarket create(@Valid @RequestBody CreateSupermarketModel createSupermarketModel, OAuth2Authentication authentication) {
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
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);
        if (user.getRole() != Role.MANAGER_USER) {
            throw new UnauthorizedException(String.format("User %s doesn't has this permission.", username));
        }

        Supermarket supermarket = supermarketRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not found a supermarket with id %s", id)));

        supermarketRepository.delete(supermarket);
    }
}
