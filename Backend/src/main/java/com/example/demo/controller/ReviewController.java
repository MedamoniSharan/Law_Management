package com.example.demo.controller;

import com.example.demo.model.Review;
import com.example.demo.model.ReviewRequestDTO;
import com.example.demo.model.ReviewResponseDTO;
import com.example.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;


import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {

  @Autowired
  private ReviewRepository reviewRepository;

  @PostMapping("/add")
  public ResponseEntity<Review> createReview(@RequestBody ReviewRequestDTO dto) {
    Review review = new Review();
    review.setAppointmentId(dto.getAppointmentId());
    review.setClientId(dto.getClientId());
    review.setLawyerId(dto.getLawyerId());
    review.setRating(dto.getRating());
    review.setComment(dto.getComment());
    review.setCreatedAt(LocalDateTime.now());
    review.setUpdatedAt(LocalDateTime.now());
    return ResponseEntity.ok(reviewRepository.save(review));
  }

  @PatchMapping("/{id}/respond")
  public ResponseEntity<Review> respondToReview(@PathVariable Long id, @RequestBody ReviewResponseDTO dto) {
    return reviewRepository.findById(id)
        .map(r -> {
          r.setResponse(dto.getResponse());
          r.setUpdatedAt(LocalDateTime.now());
          return ResponseEntity.ok(reviewRepository.save(r));
        })
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/lawyer/{lawyerId}")
  public ResponseEntity<List<Review>> getReviewsForLawyer(@PathVariable Long lawyerId) {
    return ResponseEntity.ok(reviewRepository.findByLawyerId(lawyerId));
  }

  @GetMapping("/client/{clientId}")
  public ResponseEntity<List<Review>> getReviewsForClient(@PathVariable Long clientId) {
    return ResponseEntity.ok(reviewRepository.findByClientId(clientId));
  }
}
