package com.voting.onlinevotingsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                 // Lombok generates getters, setters, toString, equals, hashCode
@NoArgsConstructor     // Lombok generates an empty constructor
@AllArgsConstructor    // Lombok generates a constructor with all fields
public class PollOption {

    private String optionText;   // e.g. "Java"
    private int voteCount = 0;   // starts at 0 votes
}
