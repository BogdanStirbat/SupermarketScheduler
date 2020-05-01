package com.bstirbat.supermarketscheduler.controller;

import com.bstirbat.supermarketscheduler.entity.Role;
import com.bstirbat.supermarketscheduler.entity.User;
import com.bstirbat.supermarketscheduler.exception.ValidationFailedException;
import com.bstirbat.supermarketscheduler.model.SignUpModel;
import com.bstirbat.supermarketscheduler.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/signup")
public class SignUpController {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public SignUpController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public User signUp(@Valid @RequestBody SignUpModel signUpModel) {

        User existingUser = userRepository.findByUsername(signUpModel.getUserName());
        if (existingUser != null) {
            throw new ValidationFailedException("User already exists!");
        }

        if (!isValid(signUpModel.getUserName())) {
            throw new ValidationFailedException("Username is not a valid email.");
        }

        User user = new User();
        user.setUsername(signUpModel.getUserName());
        user.setPassword(passwordEncoder.encode(signUpModel.getPassword()));
        user.setRole(Role.REGULAR_USER);

        return userRepository.save(user);
    }


    private boolean isValid(String email) {
        String regex = "^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$";
        return email.matches(regex);
    }
}
