package com.example.demo.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String password;
    private String role;

    private String bio;
    private String location;
    private Integer consultationFee;
    private String barCouncilNumber;
    private Integer yearsOfExperience;

    private boolean isVerified;  // Optional boolean flag

    private String verificationStatus; // "pending", "verified", "rejected"

    @ElementCollection
    private List<String> specializations;

    @ElementCollection
    private List<String> languages;

    @ElementCollection
    private List<String> education;

    // New fields
    private String aadhaarPan;
    private String driveLink;

    // Getters and Setters
    public String getAadhaarPan() {
        return aadhaarPan;
    }
    public void setAadhaarPan(String aadhaarPan) {
        this.aadhaarPan = aadhaarPan;
    }

    public String getDriveLink() {
        return driveLink;
    }
    public void setDriveLink(String driveLink) {
        this.driveLink = driveLink;
    }

    // Getters and Setters (can be generated via Lombok or manually)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getConsultationFee() { return consultationFee; }
    public void setConsultationFee(Integer consultationFee) { this.consultationFee = consultationFee; }

    public String getBarCouncilNumber() { return barCouncilNumber; }
    public void setBarCouncilNumber(String barCouncilNumber) { this.barCouncilNumber = barCouncilNumber; }

    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public List<String> getSpecializations() { return specializations; }
    public void setSpecializations(List<String> specializations) { this.specializations = specializations; }

    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }

    public List<String> getEducation() { return education; }
    public void setEducation(List<String> education) { this.education = education; }

    public boolean getIsVerified() {
        return isVerified;
    }
    public void setIsVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }
    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }
}
