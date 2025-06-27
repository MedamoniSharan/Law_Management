// UserProfileController.java
package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<User> getProfile(@RequestParam String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestParam String email, @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUserProfile(email, updatedUser));
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/lawyers")
    public ResponseEntity<List<User>> getAllLawyers() {
        return ResponseEntity.ok(userService.getAllLawyers());
    }

    @PatchMapping("/verify/{id}")
    public ResponseEntity<User> verifyLawyer(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(userService.updateVerificationStatus(id, status));
    }

}
