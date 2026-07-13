package com.voting.onlinevotingsystem.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.voting.onlinevotingsystem.model.Vote;

public interface VoteRepository extends MongoRepository<Vote, String> {

    // Spring Data automatically implements this method just from its name!
    // It checks: "Does a Vote exist with this pollId AND this voterEmail?"
    boolean existsByPollIdAndVoterEmail(String pollId, String voterEmail);
}
