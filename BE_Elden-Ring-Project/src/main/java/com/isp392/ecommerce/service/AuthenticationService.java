package com.isp392.ecommerce.service;

import com.isp392.ecommerce.dto.request.AuthenticationRequest;
import com.isp392.ecommerce.dto.request.IntrospectRequest;
import com.isp392.ecommerce.dto.request.LogOutRequest;
import com.isp392.ecommerce.dto.request.VerifyOtpRequest;
import com.isp392.ecommerce.dto.response.AuthenticationResponse;
import com.isp392.ecommerce.dto.response.IntrospectResponse;
import com.isp392.ecommerce.entity.InvalidToken;
import com.isp392.ecommerce.entity.OtpToken;
import com.isp392.ecommerce.entity.User;
import com.isp392.ecommerce.enums.Role;
import com.isp392.ecommerce.exception.AppException;
import com.isp392.ecommerce.exception.ErrorCode;
import com.isp392.ecommerce.mapper.UserMapper;
import com.isp392.ecommerce.repository.InvalidTokenRepository;
import com.isp392.ecommerce.repository.OtpTokenRepository;
import com.isp392.ecommerce.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserRepository userRepository;
    InvalidTokenRepository invalidTokenRepository;
    UserMapper userMapper;
    OtpTokenRepository otpTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String  SIGNER_KEY;

    public IntrospectResponse  introspectResponse(IntrospectRequest request)
            throws JOSEException {
        boolean isValid = true;
        try {
            verifyToken(request.getToken());
        } catch (ParseException e) {
            isValid = false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();

    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USERNAME_OR_PASSWORD_WRONG));
        //check active user
        if (!user.isStatus())
            throw new AppException(ErrorCode.USER_INACTIVE);

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated =  passwordEncoder.matches(request.getPassword(),
                user.getPassword());

        if(!authenticated)
            throw new AppException(ErrorCode.USERNAME_OR_PASSWORD_WRONG);
        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .user(userMapper.toUserResponse(user))
                .build();

    }

    public AuthenticationResponse authenticate(String email, String fullName){
        //Check if user exist
        User checkUser = userRepository.findByEmail(email)
                .orElseGet(() -> User.builder()
                        .fullName(fullName)
                        .email(email)
                        .role(Role.CUSTOMER.name())
                        .googleAccount(true)
                        .status(true)
                        .build());
        //check if user is not google account
        if (!checkUser.isGoogleAccount()) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }else if(!checkUser.isStatus()){
            throw new AppException(ErrorCode.USER_INACTIVE);//if this email is not active
        } else if(checkUser.getUserId() == null){
            checkUser = userRepository.save(checkUser);
        }//If email not exist yet
        var token = generateToken(checkUser);

        return AuthenticationResponse.builder()
                .user(userMapper.toUserResponse(checkUser))
                .token(token)
                .build();
    }

    public void logOut(LogOutRequest request) throws ParseException, JOSEException {
        //verify token
        var token = verifyToken(request.getToken());
        //get Id Token
        String jit = token.getJWTClaimsSet().getJWTID();
        //get expiry time
        Date expiryTime = token.getJWTClaimsSet().getExpirationTime();
        //store in DB
        invalidTokenRepository.save(InvalidToken.builder()
                .token(jit)
                .expiryTime(expiryTime)
                .build());
    }

    public OtpToken verifyOtp(VerifyOtpRequest request){
        //get verificationToken
        OtpToken otpToken = otpTokenRepository.findById(request.getOtp())
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_OTP_INVALID));
        //check if this otp is generated for sign-up email
        if (!otpToken.getEmail().equals(request.getEmail()))
            throw new AppException(ErrorCode.EMAIL_OTP_INVALID);
        //check if otp is expired
        if (!otpToken.getExpiryTime().after(new Date()))
            throw new AppException(ErrorCode.EMAIL_OTP_EXPIRED);
        return otpToken;
    }

    private SignedJWT verifyToken(String token)
            throws ParseException, JOSEException {
        //Convert token into SignedJWT
        SignedJWT signedJWT = SignedJWT.parse(token);
        //Get expiry time
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        //Create a verifier with SIGNER KEY by using MACSigner
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        //Verify signature of signedJwt
        var verified = signedJWT.verify(verifier);

        if(!verified && expiryTime.after(new Date()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        if (invalidTokenRepository.existsById(token))
            throw new AppException(ErrorCode.TOKEN_INVALID);
        return signedJWT;
    }

    private String generateToken(User user) {
        //Create a jwt header
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        //Create a jwt claim
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("FPTU.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(365, ChronoUnit.DAYS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", user.getRole())
                .build();
        //convert jwt into JSON to create a jwt payload
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        //create jws consist of header and payload
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            //sign jws with SIGNER KEY by using MACSigner
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();//serialize to jwt
        }catch (JOSEException e){
            log.error("cannot create token, e");
            throw new RuntimeException(e);
        }
    }
}
