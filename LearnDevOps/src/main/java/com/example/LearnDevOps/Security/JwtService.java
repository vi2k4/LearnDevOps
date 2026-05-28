package com.example.LearnDevOps.Security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

        private final SecretKey key;

        public JwtService(@Value("${JWT_SECRET_KEY:abcdefghijklmnopqrstuvwxyz123456}") String secretKey) {
                this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        }

    public String generateToken(String id){

        return Jwts.builder()
                .subject(id)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 1000 * 60 * 60
                        )
                )
                .signWith(key)
                .compact();
    }

    public String extractIdUser(String token){

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}