package com.voting.onlinevotingsystem.model;

import java.util.List;

import lombok.Data;

@Data
public class CreatePollRequest {

    private String question;       // The poll question typed by admin
    private List<String> options;  // List of option texts, e.g. ["Java", "Python"]
}
