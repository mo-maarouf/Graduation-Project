package com.travelmarket.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailVerifyConfirmTokenRequest {
    @NotBlank
    private String token;
}