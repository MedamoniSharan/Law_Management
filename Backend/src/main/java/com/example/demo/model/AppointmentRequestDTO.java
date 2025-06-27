package com.example.demo.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class AppointmentRequestDTO {
  private Long clientId;
  private Long lawyerId;
  private String type;
  private List<String> notes; // Now a list
  private LocalDate date;
  private LocalTime startTime;
  private LocalTime endTime;
  private int fee;
}
