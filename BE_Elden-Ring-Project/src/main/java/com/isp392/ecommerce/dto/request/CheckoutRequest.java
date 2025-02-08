package com.isp392.ecommerce.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CheckoutRequest {
    String fullname;
    String email;
    String phone;
    String address;
    String cartId;
    float total;
    String paymentId;
}
