package com.example.demo.controller;

import com.example.demo.model.AppointmentRequestDTO;
import com.example.demo.model.Appointment;
import com.example.demo.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin("*")
public class AppointmentController {

  @Autowired
  private AppointmentService appointmentService;

  @PostMapping("/book")
  public ResponseEntity<Appointment> bookAppointment(@RequestBody AppointmentRequestDTO request) {
    return ResponseEntity.ok(appointmentService.bookAppointment(request));
  }

  @GetMapping("/lawyer/{lawyerId}")
  public ResponseEntity<List<Appointment>> getAppointmentsForLawyer(@PathVariable Long lawyerId) {
    return ResponseEntity.ok(appointmentService.getAppointmentsForLawyer(lawyerId));
  }

  @GetMapping("/client/{clientId}")
  public ResponseEntity<List<Appointment>> getAppointmentsForClient(@PathVariable Long clientId) {
    return ResponseEntity.ok(appointmentService.getAppointmentsForClient(clientId));
  }

  @PutMapping("/{appointmentId}/confirm")
  public ResponseEntity<?> confirmAppointment(@PathVariable Long appointmentId) {
    return ResponseEntity.ok(appointmentService.updateStatus(appointmentId, "confirmed"));
  }

  @PutMapping("/{appointmentId}/cancel")
  public ResponseEntity<?> cancelAppointment(
      @PathVariable Long appointmentId,
      @RequestBody Map<String, String> body
  ) {
    String reason = body.get("reason");
    return ResponseEntity.ok(appointmentService.cancelAppointment(appointmentId, reason));
  }

  @PutMapping("/{appointmentId}/add-note")
  public ResponseEntity<Appointment> addNoteToAppointment(
      @PathVariable Long appointmentId,
      @RequestBody Map<String, String> body
  ) {
    String note = body.get("note");
    return ResponseEntity.ok(appointmentService.addNoteToAppointment(appointmentId, note));
  }



}
