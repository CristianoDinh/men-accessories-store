package com.isp392.ecommerce.dto.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BuyNowRequest {
    String fullname;
    String email;
    String phone;
    String address;
    float total;
    String productId;
    String size;
    int quantity;
    String paymentId;
}
