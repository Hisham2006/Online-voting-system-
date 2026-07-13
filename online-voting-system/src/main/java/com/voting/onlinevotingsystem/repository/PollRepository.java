package com.voting.onlinevotingsystem.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.voting.onlinevotingsystem.model.Poll;

public interface PollRepository extends MongoRepository<Poll, String> {
    // No extra methods needed yet -
    // MongoRepository already gives us save(), findAll(), findById(), deleteById(), etc.
}
