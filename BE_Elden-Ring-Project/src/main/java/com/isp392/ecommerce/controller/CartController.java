package com.isp392.ecommerce.controller;


import com.isp392.ecommerce.dto.request.AddToCartRequest;
import com.isp392.ecommerce.dto.request.AddToCartRequestWrapper;
import com.isp392.ecommerce.dto.request.CreateCartRequest;
import com.isp392.ecommerce.dto.request.UpdateQuantityRequest;
import com.isp392.ecommerce.dto.response.ApiResponse;
import com.isp392.ecommerce.dto.response.CartItemResponse;
import com.isp392.ecommerce.dto.response.CartResponse;
import com.isp392.ecommerce.entity.Cart;
import com.isp392.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {

    CartService cartService;

    @PostMapping("/create")
    ApiResponse<CartResponse> createCart(@RequestBody CreateCartRequest request) {

        return ApiResponse.<CartResponse>builder()
                .message("Create cart successfully")
                .result(cartService.createCart(request.getUserId()))
                .build();
    }

    @PostMapping("/{cartId}/add/{productId}")
    ApiResponse<CartResponse> addToCart(@PathVariable("cartId") String cartId,
                                        @PathVariable("productId") String productId,
                                        @RequestBody AddToCartRequestWrapper request) {

        return ApiResponse.<CartResponse>builder()
                .message("Add to cart successfully")
                .result(cartService.addToCart(cartId, productId, request.getData()))
                .build();
    }

    @PutMapping("/{cartId}/update/{cartItemId}")
    ApiResponse<CartItemResponse> updateQuantity(@PathVariable String cartId,
                                                 @PathVariable String cartItemId,
                                                 @Valid @RequestBody UpdateQuantityRequest request) {

        return ApiResponse.<CartItemResponse>builder()
                .message("Update quantity successfully")
                .result(cartService.updateCartItemQuantity(cartId, cartItemId, request))
                .build();
    }

    @DeleteMapping("delete/{cartItemId}")
    ApiResponse<Boolean> deleteCartItem(@PathVariable String cartItemId) {

        cartService.removeCartItem(cartItemId);

        return ApiResponse.<Boolean>builder()
                .message("Delete cart item successfully")
                .result(true)
                .build();
    }

//    @GetMapping("/{cartId}")
//    ApiResponse<CartResponse> getCart(@PathVariable String cartId) {
//
//        return ApiResponse.<CartResponse>builder()
//                .message("Get cart Successfully")
//                .result(cartService.getCart(cartId))
//                .build();
//    }

    @GetMapping("/user/{userId}")
    ApiResponse<Cart> getCartByUser(@PathVariable String userId) {

        return ApiResponse.<Cart>builder()
                .message("Get cart successfully")
                .result(cartService.getCartByUser(userId))
                .build();
    }
}
