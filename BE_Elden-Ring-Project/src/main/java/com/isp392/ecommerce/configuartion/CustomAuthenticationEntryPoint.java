package com.isp392.ecommerce.configuartion;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.isp392.ecommerce.dto.response.ApiResponse;
import com.isp392.ecommerce.exception.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;
        response.setStatus(errorCode.getStatusCode().value());//Response status code of errorCode
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);//set to JSON type
        //Build ApiResponse
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        //Convert ApiResponse to JSON string
        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(apiResponse));
        //commit response to client
        response.flushBuffer();

    }
}
