package com.isp392.ecommerce.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class UserResponse {
    private String userId;
    private String email;
    private String fullName;
    private String role;
    private String phone;
    private String address;
    private boolean googleAccount;
    private boolean status;

}
