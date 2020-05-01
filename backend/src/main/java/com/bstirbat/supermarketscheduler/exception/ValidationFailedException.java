package com.bstirbat.supermarketscheduler.exception;

public class ValidationFailedException extends RuntimeException {

    public ValidationFailedException() {
        super();
    }

    public ValidationFailedException(String message) {
        super(message);
    }
}