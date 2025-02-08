package com.isp392.ecommerce.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequest {
    String name;
    String description;
    Boolean status;
    String image;
    Float price;
    Integer cateId; // ID của danh mục sản phẩm
    List<ProductVariantRequest> productVariants;
}
