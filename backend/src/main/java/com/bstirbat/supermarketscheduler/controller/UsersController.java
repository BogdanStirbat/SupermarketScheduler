package com.bstirbat.supermarketscheduler.controller;

import com.bstirbat.supermarketscheduler.entity.Role;
import com.bstirbat.supermarketscheduler.entity.User;
import com.bstirbat.supermarketscheduler.exception.NotFoundException;
import com.bstirbat.supermarketscheduler.exception.UnauthorizedException;
import com.bstirbat.supermarketscheduler.exception.ValidationFailedException;
import com.bstirbat.supermarketscheduler.model.CreateUserModel;
import com.bstirbat.supermarketscheduler.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public UsersController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<User> all(OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);
        if (user.getRole() != Role.MANAGER_USER) {
            throw new UnauthorizedException(String.format("user %s doesn't has this permission", username));
        }

        return (List<User>) userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User findById(@PathVariable Long id, OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);
        User foundUser = userRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not found user with id=%s", id)));

        if (!(user.getRole() != Role.MANAGER_USER || (foundUser.getUsername().equals(user.getUsername())))) {
            throw new UnauthorizedException(String.format("user %s doesn't has this permission", username));
        }

        return foundUser;
    }

    @GetMapping("/current-user")
    public User getCurrentUser(OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);

        return user;
    }

    @PostMapping
    public User create(@Valid @RequestBody CreateUserModel createUserModel, OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        if (!isValid(createUserModel.getUsername())) {
            throw new ValidationFailedException("Username should be a valid email address.");
        }

        User user = userRepository.findByUsername(username);
        if (user.getRole() != Role.MANAGER_USER) {
            throw new UnauthorizedException(String.format("user %s doesn't has this permission", username));
        }

        User existingUser = userRepository.findByUsername(createUserModel.getUsername());
        if (existingUser != null) {
            throw new ValidationFailedException(String.format("User %s already exists", createUserModel.getUsername()));
        }

        User newUser = new User();
        newUser.setUsername(createUserModel.getUsername());
        newUser.setPassword(passwordEncoder.encode(createUserModel.getPassword()));
        newUser.setRole(createUserModel.getRole());

        return userRepository.save(newUser);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody CreateUserModel createUserModel, OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);
        User foundUser = userRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not found user with id=%s", id)));

        if (!(user.getRole() == Role.MANAGER_USER || foundUser.getUsername().equals(user.getUsername()))) {
            throw new UnauthorizedException(String.format("user %s doesn't has this permission", username));
        }

        if (foundUser.getUsername().equals(user.getUsername())) {
            if (createUserModel.getRole() != null) {
                throw new UnauthorizedException("Current logged in user cannot change his role!");
            }
        }

        if (user.getRole() == Role.REGULAR_USER) {
            if (createUserModel.getRole() != null) {
                throw new UnauthorizedException("A regular user cannot change his role.");
            }
        }

        if (createUserModel.getUsername() != null) {
            if (!isValid(createUserModel.getUsername())) {
                throw new ValidationFailedException("Username should be a valid email address.");
            }
            foundUser.setUsername(createUserModel.getUsername());
        }

        if (createUserModel.getPassword() != null) {
            foundUser.setPassword(passwordEncoder.encode(createUserModel.getPassword()));
        }
        if (createUserModel.getRole() != null) {
            foundUser.setRole(createUserModel.getRole());
        }

        return userRepository.save(foundUser);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, OAuth2Authentication authentication) {
        String username = (String) authentication.getUserAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username);
        User foundUser = userRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Could not found user with id=%s", id)));

        if (!(user.getRole() == Role.MANAGER_USER || user.getUsername().equals(foundUser.getUsername()))) {
            throw new UnauthorizedException(String.format("user %s doesn't has this permission", username));
        }

        userRepository.delete(foundUser);
    }

    private boolean isValid(String email) {
        String regex = "^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$";
        return email.matches(regex);
    }
}
