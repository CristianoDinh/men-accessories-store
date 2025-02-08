package com.isp392.ecommerce.dto.request;

import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateQuantityRequest {
    @Min(value = 1, message = "QUANTITY_GREATER_THAN_0")
    int quantity;
}
