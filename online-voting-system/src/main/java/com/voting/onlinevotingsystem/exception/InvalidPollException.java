package com.voting.onlinevotingsystem.exception;

public class InvalidPollException extends RuntimeException {
    public InvalidPollException(String message) {
        super(message);
    }
}
