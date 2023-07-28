package org.josh.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Workshop not found!")
public class NoSuchWorkshopException extends RuntimeException{

        public NoSuchWorkshopException(String message) {
            super(message);
        }
}
