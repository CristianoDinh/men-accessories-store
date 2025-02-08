package com.isp392.ecommerce.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddToCartRequestWrapper {
    private AddToCartRequest data;

    // Constructor, getters, và setters
    public AddToCartRequestWrapper(AddToCartRequest data) {
        this.data = data;
    }

    public AddToCartRequest getData() {
        return data;
    }

    public void setData(AddToCartRequest data) {
        this.data = data;
    }
}
