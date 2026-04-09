package com.travelmarket.backend.chat.repository;

import com.travelmarket.backend.chat.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // Fetch all messages for a specific conversation, ordered chronologically.
    List<Message> findByConversationIdOrderByCreatedAtUtcAsc(Long conversationId);

    // Fetch the most recent message for a conversation.
    Optional<Message> findTopByConversationIdOrderByCreatedAtUtcDesc(Long conversationId);

}
