package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long clientId;
  private Long lawyerId;

  private String type; // video or chat
  private String status; // pending, confirmed, cancelled, completed

  @Builder.Default
  @ElementCollection
  @CollectionTable(name = "appointment_notes", joinColumns = @JoinColumn(name = "appointment_id"))
  @Column(name = "note")
  private List<String> notes = new ArrayList<>();

  private LocalDate date;
  private LocalTime startTime;
  private LocalTime endTime;

  private int fee;

  private String cancelReason; // optional
}
