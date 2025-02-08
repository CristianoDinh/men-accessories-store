package com.isp392.ecommerce.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {
    private String fullName;
    private String phone;
    private String address;
    private boolean status = true;
}
