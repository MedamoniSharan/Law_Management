package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Review {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long appointmentId;
  private Long clientId;
  private Long lawyerId;

  private int rating;

  @Column(columnDefinition = "TEXT")
  private String comment;

  @Column(columnDefinition = "TEXT")
  private String response;

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
