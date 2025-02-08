package com.isp392.ecommerce.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "invalidTokens")
public class InvalidToken {
    @Id
    private String token;
    private Date expiryTime;
}
