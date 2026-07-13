package com.voting.onlinevotingsystem.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "votes")   // Maps this class to the "votes" collection
public class Vote {

    @Id
    private String id;

    private String pollId;       // Which poll this vote belongs to
    private String voterEmail;   // Who voted (used to prevent duplicate voting)
    private String selectedOption; // Which option text they voted for
}
