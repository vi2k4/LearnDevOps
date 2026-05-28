package com.example.LearnDevOps.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    @Autowired
    private JwtService jwtService;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        String token = resolveToken(request);
        if (!StringUtils.hasText(token)) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        try {
            String userId = jwtService.extractIdUser(token);
            if (!StringUtils.hasText(userId)) {
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return false;
            }

            // Store user id in WebSocket session attributes for downstream handlers.
            attributes.put("userId", userId);
            return true;
        } catch (Exception ex) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
        // no-op
    }

    private String resolveToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (StringUtils.hasText(authHeader)) {
            if (!authHeader.startsWith("Bearer ")) {
                return null;
            }
            String token = authHeader.substring(7).trim();
            return StringUtils.hasText(token) ? token : null;
        }

        if (request instanceof ServletServerHttpRequest servletRequest) {
            String token = servletRequest.getServletRequest().getParameter("token");
            if (!StringUtils.hasText(token)) {
                token = servletRequest.getServletRequest().getParameter("access_token");
            }
            return StringUtils.hasText(token) ? token.trim() : null;
        }

        return null;
    }
}

