package com.isp392.ecommerce.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariantRequest {
    String sizeName; // ID của kích thước
    Integer quantity; // Số lượng cho kích thước này
}
