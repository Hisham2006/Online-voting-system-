package com.voting.onlinevotingsystem.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "polls")   // Maps this class to the "polls" collection in MongoDB
public class Poll {

    @Id
    private String id;              // MongoDB auto-generates this unique ID

    private String question;        // The poll question
    private List<PollOption> options; // List of 2-4 options
}
