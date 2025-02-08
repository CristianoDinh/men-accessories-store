package com.isp392.ecommerce.dto.response;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponse {
    String cartId;
    String userId;
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    Date createDate;

    List<CartItemResponse> items;

}
