package com.voting.onlinevotingsystem.model;

import lombok.Data;

@Data
public class VoteRequest {

    private String voterEmail;     // Email of the person voting
    private String selectedOption; // The option text they are voting for
}
