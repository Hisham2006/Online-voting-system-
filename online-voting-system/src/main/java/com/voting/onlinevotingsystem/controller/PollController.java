package com.voting.onlinevotingsystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.voting.onlinevotingsystem.model.CreatePollRequest;
import com.voting.onlinevotingsystem.model.Poll;
import com.voting.onlinevotingsystem.model.VoteRequest;
import com.voting.onlinevotingsystem.service.PollService;

@RestController              // Combines @Controller + @ResponseBody -> returns JSON directly
@RequestMapping("/polls")    // Base path for all endpoints in this controller
public class PollController {

    @Autowired
    private PollService pollService;

    // POST /polls  -> Admin creates a poll
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)  // Returns HTTP 201
    public Poll createPoll(@RequestBody CreatePollRequest request) {
        return pollService.createPoll(request);
    }

    // GET /polls  -> View all polls
    @GetMapping
    public List<Poll> getAllPolls() {
        return pollService.getAllPolls();
    }

    // GET /polls/{id}  -> View one poll
    @GetMapping("/{id}")
    public Poll getPollById(@PathVariable String id) {
        return pollService.getPollById(id);
    }

    // POST /polls/{id}/vote  -> Vote on a poll
    @PostMapping("/{id}/vote")
    public Poll voteOnPoll(@PathVariable String id, @RequestBody VoteRequest voteRequest) {
        return pollService.voteOnPoll(id, voteRequest);
    }

    // GET /polls/{id}/results  -> View results
    @GetMapping("/{id}/results")
    public Poll getPollResults(@PathVariable String id) {
        return pollService.getPollResults(id);
    }
}
