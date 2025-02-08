package com.isp392.ecommerce.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RefundRequestResponse {
    String refundRequestId;
    String orderId;
    String status;
    String refundReason;
    String refundReasonImage;
    String adminId;
    Date createDate;
}
