package com.travelmarket.backend.chat.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InitiateConversationRequest {
    @NotNull(message = "tourId is required")
    private Long tourId;
    
    // Optional
    private Long bookingId;
}
