package com.isp392.ecommerce.mapper;

import com.isp392.ecommerce.dto.request.ProductCreateRequest;
import com.isp392.ecommerce.dto.request.ProductUpdateRequest;
import com.isp392.ecommerce.dto.response.ProductResponse;
import com.isp392.ecommerce.entity.Product;
import org.mapstruct.Mapper;

@Mapper
public interface ProductMapper {
    Product toproduct(ProductCreateRequest productCreateRequest);

}
