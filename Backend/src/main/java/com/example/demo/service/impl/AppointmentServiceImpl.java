package com.example.demo.service.impl;

import com.example.demo.model.Appointment;
import com.example.demo.model.AppointmentRequestDTO;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

  @Autowired
  private AppointmentRepository repository;

  @Override
  public Appointment updateStatus(Long id, String status) {
    Appointment apt = repository.findById(id).orElseThrow();
    apt.setStatus(status);
    return repository.save(apt);
  }

  @Override
  public Appointment cancelAppointment(Long id, String reason) {
    Appointment apt = repository.findById(id).orElseThrow();
    apt.setStatus("cancelled");
    apt.setCancelReason(reason); // ✅ Set cancel reason separately
    apt.getNotes().add("Cancelled: " + reason); // ✅ Optionally add to notes
    return repository.save(apt);
  }



  @Override
  public Appointment bookAppointment(AppointmentRequestDTO request) {
    Appointment appointment = Appointment.builder()
        .clientId(request.getClientId())
        .lawyerId(request.getLawyerId())
        .type(request.getType())
        .status("pending")
        .notes(request.getNotes() != null ? request.getNotes() : new ArrayList<>())
        .date(request.getDate())
        .startTime(request.getStartTime())
        .endTime(request.getEndTime())
        .fee(request.getFee())
        .build();

    return repository.save(appointment);
  }


  @Override
  public List<Appointment> getAppointmentsForLawyer(Long lawyerId) {
    return repository.findByLawyerId(lawyerId);
  }

  @Override
  public List<Appointment> getAppointmentsForClient(Long clientId) {
    return repository.findByClientId(clientId);
  }

  @Override
  public Appointment addNoteToAppointment(Long id, String note) {
    Appointment apt = repository.findById(id).orElseThrow();
    apt.getNotes().add(note);
    return repository.save(apt);
  }



}
