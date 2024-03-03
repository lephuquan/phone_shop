package com.PhoneShop.controller;

import com.PhoneShop.model.BillingOrder;
import com.PhoneShop.model.User;
import com.PhoneShop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import javax.validation.Valid;
import com.PhoneShop.exception.UserAlreadyExistException;

import java.security.Principal;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getUser")
    public ResponseEntity<?> getUserBySessionId(Principal principal) {
        org.springframework.security.core.userdetails.User loginedUser = (org.springframework.security.core.userdetails.User) ((Authentication) principal).getPrincipal();
        return ResponseEntity.ok(userService.findByUsername(loginedUser.getUsername()));
    }


    @GetMapping("/getUser-info")
    public ResponseEntity<?> getUserInfo(Principal principal) {
        org.springframework.security.core.userdetails.User loginedUser = (org.springframework.security.core.userdetails.User) ((Authentication) principal).getPrincipal();
        return ResponseEntity.ok(userService.getUserInforByUsername(loginedUser.getUsername()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.createAccount(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        return ResponseEntity.ok(userService.login(user));
    }

//    @GetMapping("/testRigister")
//    public String register(final Green_denstination_place.Green_denstination_place.Model model){
//        model.addAttribute("userData", new User());
//        return "testRigister";
//    }
//
//    @PostMapping("/testRigister")
//    public String userRegistration(final @Valid  User user, final BindingResult bindingResult, final Green_denstination_place.Green_denstination_place.Model model){
//        if(bindingResult.hasErrors()){
//            model.addAttribute("registrationForm", user);
//            return "testRigister";
//        }
//        try {
//            userService.register(user);
//        }catch (UserAlreadyExistException e){
//            bindingResult.rejectValue("email", "userData.email","An account already exists for this email.");
//            model.addAttribute("registrationForm", user);
//            return "testRigister";
//        }
//        return  "redirect:/home";
//    }
}
