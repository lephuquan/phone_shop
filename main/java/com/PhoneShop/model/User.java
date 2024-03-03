package com.PhoneShop.model;

import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import java.util.List;

@Getter
@Setter
public class User {

    private Integer id;

    @NotEmpty(message = "First name can not be empty")
    private String firstname;

    @NotEmpty(message = "Last name can not be empty")
    private String lastname;

    private String username;

    @NotEmpty(message = "Email can not be empty")
    @Email(message = "Please provide a valid email id")
    private String email;

    private Boolean gender;

    @NotEmpty(message = "Password can not be empty")
    private String password;

    private String sessionId;

    private String role;

    private List<String> roleList;
}
