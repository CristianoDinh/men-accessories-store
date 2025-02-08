package com.isp392.ecommerce.controller;

import com.isp392.ecommerce.dto.request.BuyNowRequest;
import com.isp392.ecommerce.dto.request.CheckoutRequest;
import com.isp392.ecommerce.dto.response.ApiResponse;
import com.isp392.ecommerce.dto.response.CheckoutResponse;
import com.isp392.ecommerce.dto.response.OrderResponse;
import com.isp392.ecommerce.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping("/create/checkout")
    ApiResponse<CheckoutResponse> checkout(@RequestBody CheckoutRequest request) {
        return ApiResponse.<CheckoutResponse>builder()
                .message("Checkout successfully!")
                .result(orderService.checkout(request))
                .build();
    }

    @PostMapping("/create/buy-now")
    ApiResponse<CheckoutResponse> buyNow(@RequestBody BuyNowRequest request) {
        return ApiResponse.<CheckoutResponse>builder()
                .message("Buy now successfully!")
                .result(orderService.buyNow(request))
                .build();
    }

    @GetMapping("/get-my-order")
    ApiResponse<List<CheckoutResponse>> getMyOrder() {
        return ApiResponse.<List<CheckoutResponse>>builder()
                .message("Get my order successfully!")
                .result(orderService.getMyOrder())
                .build();
    }

    @GetMapping("/get-all-order")
    ApiResponse<List<CheckoutResponse>> getAllOrder() {
        return ApiResponse.<List<CheckoutResponse>>builder()
                .message("Get all order successfully!")
                .result(orderService.getAllOrder())
                .build();
    }

    @GetMapping("/{orderId}")
    ApiResponse<OrderResponse> getOrderById(@PathVariable String orderId) {
        return ApiResponse.<OrderResponse>builder()
                .result(orderService.getOrder(orderId))
                .build();
    }
}
