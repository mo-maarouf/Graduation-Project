package com.travelmarket.backend.repository;

import com.travelmarket.backend.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Transactional
    @Query("""
        update RefreshToken rt
        set rt.revokedAtUtc = :now
        where rt.id = :tokenId
          and rt.revokedAtUtc is null
    """)
    int revokeOne(@Param("tokenId") Long tokenId, @Param("now") Instant now);

    @Modifying
    @Transactional
    @Query("""
        update RefreshToken rt
        set rt.revokedAtUtc = :now
        where rt.user.id = :userId
          and rt.revokedAtUtc is null
    """)
    int revokeAllForUser(@Param("userId") Long userId, @Param("now") Instant now);
}