package com.travelmarket.backend.controller;

import com.travelmarket.backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @GetMapping("/signature")
    public Map<String, Object> getSignature(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(required = false, defaultValue = "tourongo") String folder) {
        
        // This endpoint requires authentication to prevent abuse.
        if (principal == null) {
            throw new RuntimeException("Unauthorized upload request");
        }

        return cloudinaryService.generateUploadSignature(folder);
    }
}
