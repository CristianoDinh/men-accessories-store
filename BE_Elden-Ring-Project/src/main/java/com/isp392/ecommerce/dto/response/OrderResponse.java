package com.isp392.ecommerce.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderResponse{
    String orderId;
    String paymentId;
    String userId;
    String phone;
    String address;
    String fullname;
    String email;
    float total;
    String status;
    Date createdDate;
    List<OrderDetailResponse> orderDetails;

    @Data
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class OrderDetailResponse {
        String orderDetailId;
        String productId;
        String productName;
        float unitPrice;
        String description;
        String size;
        float total;
        int quantity;
    }
}
