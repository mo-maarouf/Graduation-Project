package com.travelmarket.backend.tour.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class PublicActiveWaitlistResponse {
    private Long id;
    private Long occurrenceId;
    private Integer peopleCount;
    private Integer position;
    private Instant createdAt;
}
