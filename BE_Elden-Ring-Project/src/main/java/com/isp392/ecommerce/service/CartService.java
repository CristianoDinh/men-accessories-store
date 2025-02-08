package com.isp392.ecommerce.service;

import com.isp392.ecommerce.dto.request.AddToCartRequest;
import com.isp392.ecommerce.dto.request.UpdateQuantityRequest;
import com.isp392.ecommerce.dto.response.CartItemResponse;
import com.isp392.ecommerce.dto.response.CartResponse;
import com.isp392.ecommerce.entity.*;
import com.isp392.ecommerce.exception.AppException;
import com.isp392.ecommerce.exception.ErrorCode;
import com.isp392.ecommerce.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService {

    CartRepository cartRepository;
    CartItemRepository cartItemRepository;
    UserRepository userRepository;
    ProductRepository productRepository;
    SizeRepository sizeRepository;  // Thêm SizeRepository
    ProductVariantRepository productVariantRepository;

    public CartResponse createCart(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (cartRepository.existsByUser(user))
            throw new AppException(ErrorCode.CART_ALREADY_EXISTED);

        Cart cart = cartRepository.save(Cart.builder()
                .user(user)
                .createDate(new Date())
                .build());

        return CartResponse.builder()
                .cartId(cart.getCartId())
                .userId(cart.getUser().getUserId())
                .createDate(cart.getCreateDate())
                .build();
    }

    // Thêm sản phẩm vào giỏ hàng với size
    public CartResponse addToCart(String cartId, String productId, AddToCartRequest request) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        Size size = sizeRepository.findByName(request.getSizeName())  // Tìm size theo tên
                .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_EXISTED));

        ProductVariant productVariant = productVariantRepository.findBySizeIdAndProductId(size.getSizeId(), productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

        boolean productExistsInCart = false;

        // Kiểm tra xem sản phẩm với size này đã tồn tại trong giỏ hàng chưa
        for (CartItem item : cart.getCartItems()) {
            if (Objects.equals(item.getProduct().getProductId(), productId) && item.getSize().getName().equals(size.getName())) {

                int newQuantity = item.getQuantity() + request.getQuantity();

                // Kiểm tra nếu tổng số lượng vượt quá stock
                if (newQuantity > productVariant.getQuantity()) {
                    throw new AppException(ErrorCode.QUANTITY_EXCEEDS_STOCK);
                }

                item.setQuantity(newQuantity);  // Cập nhật số lượng
                cartItemRepository.save(item);
                productExistsInCart = true;
                break;
            }
        }

        // Nếu sản phẩm với size chưa tồn tại, thêm mới
        if (!productExistsInCart) {
            if (request.getQuantity() > productVariant.getQuantity()) {
                throw new AppException(ErrorCode.QUANTITY_EXCEEDS_STOCK);
            }
            CartItem cartItem = cartItemRepository.save(CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .size(size)  // Thêm size vào CartItem
                    .quantity(request.getQuantity())
                    .build());
            cart.getCartItems().add(cartItem);
        }

        // Trả về giỏ hàng sau khi thêm sản phẩm
        List<CartItemResponse> itemResponses = cart.getCartItems().stream()
                .map(item -> CartItemResponse.builder()
                        .cartItemId(item.getCartItemId())
                        .productId(item.getProduct().getProductId())
                        .sizeName(item.getSize().getName())  // Trả về size trong response
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        return CartResponse.builder()
                .cartId(cartId)
                .userId(cart.getUser().getUserId())
                .createDate(cart.getCreateDate())
                .items(itemResponses)
                .build();
    }

    public CartItemResponse updateCartItemQuantity(String cartId, String cartItemId, UpdateQuantityRequest request) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        ProductVariant productVariant = productVariantRepository.findBySizeIdAndProductId(cartItem.getSize().getSizeId(), cartItem.getProduct().getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

        // Cập nhật số lượng của CartItem
        if(request.getQuantity() > 0&& request.getQuantity() <= productVariant.getQuantity())
            cartItem.setQuantity(request.getQuantity());
        else
            throw new AppException(ErrorCode.QUANTITY_EXCEEDS_STOCK);

        cartItemRepository.save(cartItem);

        // Trả về CartItemResponse
        return CartItemResponse.builder()
                .cartItemId(cartItem.getCartItemId())
                .productId(cartItem.getProduct().getProductId())
                .quantity(cartItem.getQuantity())
                .build();
    }

    public void removeCartItem(String cartItemId) {
        if (cartItemRepository.existsById(cartItemId)) {
            cartItemRepository.deleteCartItemById(cartItemId);
        } else
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
    }

    public CartResponse getCart(String cartId) {
        // Tìm giỏ hàng theo cartId
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        // Chuyển đổi Cart thành CartResponse
        List<CartItemResponse> itemResponses = cart.getCartItems().stream()
                .map(item -> CartItemResponse.builder()
                        .cartItemId(item.getCartItemId())
                        .productId(item.getProduct().getProductId())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        return CartResponse.builder()
                .cartId(cart.getCartId())
                .userId(cart.getUser().getUserId())
                .createDate(cart.getCreateDate())
                .items(itemResponses) // Thêm danh sách các item đã chuyển đổi
                .build();
    }

    public Cart getCartByUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Cart cart = user.getCart();

        if (cart == null) throw new AppException(ErrorCode.CART_NOT_FOUND);

        return cart;
    }

}

