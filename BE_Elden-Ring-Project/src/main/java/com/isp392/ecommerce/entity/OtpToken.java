package com.isp392.ecommerce.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "otpTokens")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OtpToken {
    @Id
    int otp;
    Date expiryTime;
    String email;
    String password;
    String fullname;
}
