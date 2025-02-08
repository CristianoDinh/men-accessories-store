package com.isp392.ecommerce.dto.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefundRequestRequest {
    String orderId;
    String refundReason;
    String refundReasonImage;
}
