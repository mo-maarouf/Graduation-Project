package com.travelmarket.backend.booking.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request DTO for a traveler to update their existing booking.
 * Allows changing the group size or switching to a different occurrence (date).
 */
@Data
public class  UpdateBookingRequest {

    @NotNull(message = "Occurrence ID is required")
    private Long occurrenceId;

    @NotNull(message = "People count is required")
    @Min(value = 1, message = "At least 1 person is required")
    private Integer peopleCount;

    // Optional: if true, the user understands they might be moved to waitlist
    // if guest count increases beyond capacity.
    private Boolean confirmWaitlistTransition = false;
}
