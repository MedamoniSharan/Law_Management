package com.example.demo.model;
import lombok.Data;

@Data
public class ReviewRequestDTO {
  private Long appointmentId;
  private Long clientId;
  private Long lawyerId;
  private int rating;
  private String comment;
}

