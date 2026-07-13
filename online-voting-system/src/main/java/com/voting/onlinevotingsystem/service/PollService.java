package com.voting.onlinevotingsystem.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.voting.onlinevotingsystem.exception.DuplicateVoteException;
import com.voting.onlinevotingsystem.exception.InvalidPollException;
import com.voting.onlinevotingsystem.exception.PollNotFoundException;
import com.voting.onlinevotingsystem.model.CreatePollRequest;
import com.voting.onlinevotingsystem.model.Poll;
import com.voting.onlinevotingsystem.model.PollOption;
import com.voting.onlinevotingsystem.model.Vote;
import com.voting.onlinevotingsystem.model.VoteRequest;
import com.voting.onlinevotingsystem.repository.PollRepository;
import com.voting.onlinevotingsystem.repository.VoteRepository;

@Service   // Marks this as a Spring-managed service (business logic layer)
public class PollService {

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private VoteRepository voteRepository;

    // --------------------------------------------------
    // 1. CREATE A POLL
    // --------------------------------------------------
    public Poll createPoll(CreatePollRequest request) {

        // Validation: question cannot be empty
        if (request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
            throw new InvalidPollException("Poll question cannot be empty.");
        }

        // Validation: must have 2 to 4 options
        if (request.getOptions() == null || request.getOptions().size() < 2 || request.getOptions().size() > 4) {
            throw new InvalidPollException("Poll must contain between 2 and 4 options.");
        }

        // Convert plain option strings into PollOption objects (with voteCount = 0)
        List<PollOption> pollOptions = request.getOptions().stream()
                .map(text -> new PollOption(text, 0))
                .collect(Collectors.toList());

        Poll poll = new Poll();
        poll.setQuestion(request.getQuestion());
        poll.setOptions(pollOptions);

        return pollRepository.save(poll);  // Saves to MongoDB "polls" collection
    }

    // --------------------------------------------------
    // 2. GET ALL POLLS
    // --------------------------------------------------
    public List<Poll> getAllPolls() {
        return pollRepository.findAll();
    }

    // --------------------------------------------------
    // 3. GET A SINGLE POLL BY ID
    // --------------------------------------------------
    public Poll getPollById(String id) {
        return pollRepository.findById(id)
                .orElseThrow(() -> new PollNotFoundException("Poll not found with id: " + id));
    }

    // --------------------------------------------------
    // 4. VOTE ON A POLL
    // --------------------------------------------------
    public Poll voteOnPoll(String pollId, VoteRequest voteRequest) {

        // Validate voter email
        if (voteRequest.getVoterEmail() == null || voteRequest.getVoterEmail().trim().isEmpty()) {
            throw new InvalidPollException("Voter email is required.");
        }

        // Find the poll first
        Poll poll = getPollById(pollId);

        // Check if this person already voted on this poll
        boolean alreadyVoted = voteRepository.existsByPollIdAndVoterEmail(pollId, voteRequest.getVoterEmail());
        if (alreadyVoted) {
            throw new DuplicateVoteException("You have already voted on this poll.");
        }

        // Find the matching option and increase its vote count
        boolean optionFound = false;
        for (PollOption option : poll.getOptions()) {
            if (option.getOptionText().equalsIgnoreCase(voteRequest.getSelectedOption())) {
                option.setVoteCount(option.getVoteCount() + 1);
                optionFound = true;
                break;
            }
        }

        if (!optionFound) {
            throw new InvalidPollException("Selected option does not exist in this poll.");
        }

        // Save the updated poll (with new vote count)
        Poll updatedPoll = pollRepository.save(poll);

        // Record this vote so the person can't vote again
        Vote vote = new Vote();
        vote.setPollId(pollId);
        vote.setVoterEmail(voteRequest.getVoterEmail());
        vote.setSelectedOption(voteRequest.getSelectedOption());
        voteRepository.save(vote);

        return updatedPoll;
    }

    // --------------------------------------------------
    // 5. GET RESULTS FOR A POLL
    // --------------------------------------------------
    public Poll getPollResults(String pollId) {
        return getPollById(pollId); // Poll object already contains vote counts per option
    }
}
