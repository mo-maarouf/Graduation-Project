package com.travelmarket.backend.dto;

public record EmailVerifyDevResponse(
        String message,
        String verifyLinkToken,
        String verifyCode
) {}