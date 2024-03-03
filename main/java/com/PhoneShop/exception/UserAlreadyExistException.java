package com.PhoneShop.exception;

import com.PhoneShop.entity.UserEntity;
import com.PhoneShop.model.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

public class UserAlreadyExistException extends Exception {


    public UserAlreadyExistException(@NotEmpty(message = "Email can not be empty") @Email(message = "Please provide a valid email id") String email) {
    }


}