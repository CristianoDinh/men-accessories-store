package com.isp392.ecommerce.dto.request;

import com.isp392.ecommerce.entity.Category;
import com.isp392.ecommerce.entity.OrderDetail;
import com.isp392.ecommerce.entity.ProductVariant;
import jakarta.persistence.*;
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
public class ProductCreateRequest {
    String name;
    String description;
    Boolean status;
    String image;
    Float price;
    Integer cateId; // ID của danh mục sản phẩm
    List<ProductVariantRequest> productVariants; // Danh sách các kích thước và số lượng
}

