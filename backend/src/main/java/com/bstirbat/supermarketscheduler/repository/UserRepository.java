package com.bstirbat.supermarketscheduler.repository;

import com.bstirbat.supermarketscheduler.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
    User findByUsername(String username);
}
