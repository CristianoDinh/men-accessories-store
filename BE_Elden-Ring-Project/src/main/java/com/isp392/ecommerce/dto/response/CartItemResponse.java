package com.isp392.ecommerce.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    private String cartItemId;
    private String productId;
    private String sizeName;  // Thêm sizeName vào response
    private int quantity;
}
