package com.travelmarket.backend.controller;

import com.travelmarket.backend.entity.SupportMessage;
import com.travelmarket.backend.entity.SupportTicket;
import com.travelmarket.backend.repository.SupportMessageRepository;
import com.travelmarket.backend.repository.SupportTicketRepository;
import com.travelmarket.backend.repository.UserRepository;
import com.travelmarket.backend.service.EmailService;
import com.travelmarket.backend.notification.service.NotificationService;
import com.travelmarket.backend.notification.enums.NotificationType;
import com.travelmarket.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/support")
@RequiredArgsConstructor
@PreAuthorize("hasRole('Admin')")
public class AdminSupportController {

    private final SupportTicketRepository ticketRepository;
    private final SupportMessageRepository messageRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @GetMapping("/tickets")
    public ResponseEntity<List<SupportTicket>> getAllTickets() {
        return ResponseEntity.ok(ticketRepository.findAllByOrderByCreatedAtUtcDesc());
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<SupportTicket> getTicket(@PathVariable Long id) {
        return ticketRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/tickets/{id}/status")
    public ResponseEntity<SupportTicket> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        
        return ticketRepository.findById(id)
                .map(ticket -> {
                    SupportTicket.TicketStatus newStatus = SupportTicket.TicketStatus.valueOf(body.get("status"));
                    SupportTicket.TicketStatus currentStatus = ticket.getStatus();
                    
                    if (currentStatus == SupportTicket.TicketStatus.RESOLVED) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot change status of a resolved ticket");
                    }
                    if (currentStatus == SupportTicket.TicketStatus.OPEN && newStatus == SupportTicket.TicketStatus.RESOLVED) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ticket must be IN_PROGRESS before it can be RESOLVED");
                    }

                    ticket.setStatus(newStatus);
                    if (body.containsKey("adminNote")) {
                        ticket.setAdminNote(body.get("adminNote"));
                    }
                    SupportTicket savedTicket = ticketRepository.save(ticket);
                    
                    // Send email notification to user about status change
                    String emailHtml = String.format(
                        "<h3>Update on your Support Ticket #%d</h3>" +
                        "<p>Hi %s,</p>" +
                        "<p>The status of your support ticket (<b>%s</b>) has been changed to: <b>%s</b></p>" +
                        "<p>Best regards,<br/>Tourongo Support Team</p>",
                        savedTicket.getId(), savedTicket.getName(), savedTicket.getSubject(), savedTicket.getStatus()
                    );
                    emailService.sendHtml(savedTicket.getEmail(), "Status Update: Support Ticket #" + savedTicket.getId(), emailHtml);

                    // Send in-app notification if the user is registered
                    userRepository.findByEmail(savedTicket.getEmail()).ifPresent(user -> {
                        notificationService.createNotificationInAppOnly(
                            user.getId(),
                            NotificationType.SYSTEM_ALERT,
                            "Support Ticket Updated",
                            "Your support ticket status is now: " + savedTicket.getStatus(),
                            savedTicket.getId().toString(),
                            "SUPPORT_TICKET"
                        );
                    });
                    
                    return ResponseEntity.ok(savedTicket);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/tickets/{id}/messages")
    public ResponseEntity<SupportMessage> sendMessage(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        
        SupportTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (ticket.getStatus() == SupportTicket.TicketStatus.RESOLVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot send messages to a resolved ticket");
        }

        SupportMessage message = SupportMessage.builder()
                .ticket(ticket)
                .senderName("Admin")
                .senderEmail("support@safaribub.com")
                .adminMessage(true)
                .content(body.get("content"))
                .build();

        message = messageRepository.save(message);

        // Send email notification to user
        String emailHtml = String.format(
            "<h3>Update on your Support Ticket #%d</h3>" +
            "<p>Hi %s,</p>" +
            "<p>An admin has replied to your support ticket:</p>" +
            "<blockquote style='border-left: 4px solid #ddd; padding-left: 10px; color: #555;'>%s</blockquote>" +
            "<p>Best regards,<br/>Tourongo Support Team</p>",
            ticket.getId(), ticket.getName(), message.getContent()
        );
        emailService.sendHtml(ticket.getEmail(), "Update on Support Ticket #" + ticket.getId(), emailHtml);

        // Send in-app notification if the user is registered
        userRepository.findByEmail(ticket.getEmail()).ifPresent(user -> {
            notificationService.createNotificationInAppOnly(
                user.getId(),
                NotificationType.NEW_MESSAGE,
                "Support Reply",
                "An admin has replied to your support ticket: " + ticket.getSubject(),
                ticket.getId().toString(),
                "SUPPORT_TICKET"
            );
        });

        return ResponseEntity.ok(message);
    }
}
