package com.zackmurry.raghavio.config;

import com.zackmurry.raghavio.exception.BadRequestException;
import com.zackmurry.raghavio.exception.NotFoundException;
import com.zackmurry.raghavio.exception.InternalServerException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletResponse;

@RestControllerAdvice
public class WebRestControllerAdvice {

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleBadRequestException(BadRequestException exception, HttpServletResponse response) {
        return exception.getMessage();
    }

    @ExceptionHandler(InternalServerException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleInternalServerException(InternalServerException exception, HttpServletResponse response) {
        exception.printStackTrace();
        return exception.getMessage();
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleGameNotFoundException(NotFoundException exception, HttpServletResponse response) {
        return exception.getMessage();
    }

}
