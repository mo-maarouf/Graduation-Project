package com.travelmarket.backend.tour.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Summary of an active booking for a traveler on a specific occurrence.
 * Included in the public tour detail response to enable personalized actions
 * (e.g. "Update Booking" instead of "Book Now") for specific dates.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicActiveBookingResponse {
    private Long id;
    private String status;
    private Long occurrenceId;
    private Integer peopleCount;
    private BigDecimal finalPrice;
    private String currency;
    private Instant startTime;
}
