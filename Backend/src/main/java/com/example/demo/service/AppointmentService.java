package com.example.demo.service;

import com.example.demo.model.Appointment;
import com.example.demo.model.AppointmentRequestDTO;

import java.util.List;

public interface AppointmentService {
  Appointment updateStatus(Long id, String status);

  Appointment addNoteToAppointment(Long id, String note);

  Appointment cancelAppointment(Long id, String reason);

  Appointment bookAppointment(AppointmentRequestDTO request);
  List<Appointment> getAppointmentsForLawyer(Long lawyerId);
  List<Appointment> getAppointmentsForClient(Long clientId);
}
