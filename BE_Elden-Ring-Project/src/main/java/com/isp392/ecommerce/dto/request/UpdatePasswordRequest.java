package com.isp392.ecommerce.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdatePasswordRequest {
    String oldPassword;
    String newPassword;
}
