package com.isp392.ecommerce.service;
//import class

import com.isp392.ecommerce.dto.request.ResetPasswordRequest;
import com.isp392.ecommerce.dto.request.UpdatePasswordRequest;
import com.isp392.ecommerce.dto.request.UserCreationRequest;
import com.isp392.ecommerce.dto.request.UserUpdateRequest;
import com.isp392.ecommerce.dto.response.UserResponse;
import com.isp392.ecommerce.entity.OtpToken;
import com.isp392.ecommerce.entity.User;
import com.isp392.ecommerce.enums.Role;
import com.isp392.ecommerce.exception.AppException;
import com.isp392.ecommerce.exception.ErrorCode;
import com.isp392.ecommerce.mapper.UserMapper;
import com.isp392.ecommerce.repository.OtpTokenRepository;
import com.isp392.ecommerce.repository.UserRepository;
//framework
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
//return type
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    OtpTokenRepository otpTokenRepository;
    JavaMailSender mailSender;


    @NonFinal
    @Value("${spring.mail.username}")
    protected String SENDER_EMAIL;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    public User getUserById(String id) {// findById() return Optional DType
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    public User create(UserCreationRequest createRequest) {
        User user = userMapper.toUser(createRequest);
        user.setPassword(passwordEncoder().encode(createRequest.getPassword()));
        user.setRole(Role.CUSTOMER.name());
        if (userRepository.existsByEmail(createRequest.getEmail()))
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        return userRepository.save(user);
    }

    public UserResponse getMyInfo() {
        return userMapper.toUserResponse(getCurrentUser());
    }

    public UserResponse updateMyInfo(UserUpdateRequest request) {
        User user = getCurrentUser();
        userMapper.updateUser(user, request);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void updatePassword(UpdatePasswordRequest request) {
        //Get current user who is login
        User user = getCurrentUser();
        //Check if the old password match the current
        if (!passwordEncoder().matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.WRONG_PASSWORD);
        }
        //Check if the new password match the current
        if (passwordEncoder().matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.MATCH_OLD_PASSWORD);
        }
        //Save new password
        user.setPassword(passwordEncoder().encode(request.getNewPassword()));
        userRepository.save(user);
    }


    public String forgotPassword(String email) {
        //Check username
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_EXISTED));
        //Check if google account
        if (user.isGoogleAccount())
            throw new AppException(ErrorCode.LOGGED_BY_GOOGLE);
        Random random = new Random();
        int otp;
        do {
            //random otp 6 digit number
            otp = random.nextInt(100000, 999999);
        }while (otpTokenRepository.existsById(otp));//Generate new if this otp has been created
        //Create email by SimpleMailMessage
        mailSender.send(getSimpleMailMessage(email, otp));
        otpTokenRepository.save(OtpToken.builder()
                .email(email)
                .otp(otp)
                .expiryTime(new Date(Instant.now()
                        .plus(5, ChronoUnit.MINUTES).toEpochMilli()))
                .build());

        return email;
    }

    public void resetPassword(ResetPasswordRequest request){
        //Get user who has been verified forgot password
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_EXISTED));
        //Check if reset password matches the old
        if (passwordEncoder().matches(request.getPassword(), user.getPassword()))
            throw new AppException(ErrorCode.MATCH_OLD_PASSWORD);
        //encode password
        user.setPassword(passwordEncoder().encode(request.getPassword()));
        userRepository.save(user);
    }

    private SimpleMailMessage getSimpleMailMessage(String email, int otp) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();

        simpleMailMessage.setTo(email);
        simpleMailMessage.setSubject("Forgot password");
        simpleMailMessage.setText("Hello " + email + ",\n\n" +
                "We have received a request to reset the password for your account. " +
                "Please use the following 6-digit OTP to verify your identity:\n\n" + otp +
                "\n\nThis code is valid for the next 5 minutes.");
        simpleMailMessage.setFrom(SENDER_EMAIL);
        return simpleMailMessage;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_EXISTED));
        userMapper.updateUser(user, request);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setStatus(false);
        userRepository.save(user);
    }

    private PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_EXISTED));
    }


    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse createAdminAccount(UserCreationRequest request){
        //Map request to User
        User user = userMapper.toUser(request);
        //Encode password
        user.setPassword(passwordEncoder().encode(request.getPassword()));
        //Set role Admin for account
        user.setRole(Role.ADMIN.name());
        try {
            user = userRepository.save(user);
        } catch (Exception e) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        return userMapper.toUserResponse(user);
    }
}