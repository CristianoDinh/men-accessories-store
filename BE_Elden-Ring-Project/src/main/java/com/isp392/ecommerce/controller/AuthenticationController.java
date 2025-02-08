package com.isp392.ecommerce.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.isp392.ecommerce.dto.request.AuthenticationRequest;
import com.isp392.ecommerce.dto.request.IntrospectRequest;
import com.isp392.ecommerce.dto.request.LogOutRequest;
import com.isp392.ecommerce.dto.request.VerifyOtpRequest;
import com.isp392.ecommerce.dto.response.ApiResponse;
import com.isp392.ecommerce.dto.response.AuthenticationResponse;
import com.isp392.ecommerce.dto.response.IntrospectResponse;
import com.isp392.ecommerce.exception.AppException;
import com.isp392.ecommerce.exception.ErrorCode;
import com.isp392.ecommerce.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.text.ParseException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @CrossOrigin
        @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws JOSEException {
        var result = authenticationService.introspectResponse(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)

                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogOutRequest request) throws ParseException, JOSEException {
        authenticationService.logOut(request);
        return ApiResponse.<Void>builder()
                .message("Logged out successfully")
                .build();
    }

    @PostMapping("/verify-forgot-password")
    ApiResponse<String> verifyResetPassword(@RequestBody VerifyOtpRequest request){
        return ApiResponse.<String>builder()
                .message("Verify successfully!")
                .result(authenticationService.verifyOtp(request).getEmail())
                .build();
    }

    @PostMapping("/login-by-google")
    public ApiResponse<AuthenticationResponse> loginSuccess(@RequestBody String request) throws IOException {
        //get user info by access token
        String userInfoEndpoint = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + request;
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(userInfoEndpoint, String.class);
        if (response.getStatusCode() != HttpStatus.OK)
            throw new AppException(ErrorCode.TOKEN_INVALID);
        //Convert response string to response JSON
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode userInfoJson = objectMapper.readTree(response.getBody());

        // get field we need from response
        String email = userInfoJson.get("email").asText();
        String name = userInfoJson.get("name").asText();
        return ApiResponse.<AuthenticationResponse>builder()
                .message("Sign in successfully!")
                .result(authenticationService.authenticate(email, name))
                .build();
    }
}