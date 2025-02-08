package com.isp392.ecommerce.mapper;

import com.isp392.ecommerce.dto.request.BuyNowRequest;
import com.isp392.ecommerce.dto.request.CheckoutRequest;
import com.isp392.ecommerce.dto.response.OrderResponse;
import com.isp392.ecommerce.entity.CartItem;
import com.isp392.ecommerce.entity.Order;
import com.isp392.ecommerce.entity.OrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    Order toOrder(CheckoutRequest request);
    Order toOrder(BuyNowRequest request);

    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "orderProducts", target = "orderDetails")
    OrderResponse toOrderResponse(Order order);

    @Mapping(source = "product.productId", target = "productId")
    OrderResponse.OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail);

    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.price", target = "unitPrice")
    @Mapping(source = "product.description", target = "description")
    @Mapping(expression = "java(cartItem.getProduct().getPrice() * cartItem.getQuantity())" , target = "total")
    @Mapping(target = "size", ignore = true)
    OrderDetail toOrderDetail(CartItem cartItem);
}
