package com.isp392.ecommerce.service;

import com.isp392.ecommerce.dto.request.BuyNowRequest;
import com.isp392.ecommerce.dto.request.CheckoutRequest;
import com.isp392.ecommerce.dto.response.CheckoutResponse;
import com.isp392.ecommerce.dto.response.OrderResponse;
import com.isp392.ecommerce.entity.*;
import com.isp392.ecommerce.enums.Role;
import com.isp392.ecommerce.enums.Status;
import com.isp392.ecommerce.exception.AppException;
import com.isp392.ecommerce.exception.ErrorCode;
import com.isp392.ecommerce.mapper.OrderMapper;
import com.isp392.ecommerce.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {
    OrderRepository orderRepository;
    UserRepository userRepository;
    CartRepository cartRepository;
    UserService userService;
    ProductRepository productRepository;
    OrderMapper orderMapper;
    ProductVariantRepository productVariantRepository;
    SizeRepository sizeRepository;

    public CheckoutResponse checkout(CheckoutRequest request) {
        //create new order
        Order order = createOrderObject(request);
        Cart cart;
        List<OrderDetail> orderDetails;
            //get cart
            cart = cartRepository.findById(request.getCartId())
                    .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));
            //Map quantity, product of List<CartItem> into List<OrderDetail>
            orderDetails = cart.getCartItems().stream()
                    .map(cartItem -> {
                        OrderDetail orderDetail = orderMapper.toOrderDetail(cartItem);
                        orderDetail.setOrder(order);
                        //Get product
                        Product product = cartItem.getProduct();
                        //Snapshot product
                        orderDetail.setProductName(product.getName());
                        orderDetail.setQuantity(cartItem.getQuantity());
                        orderDetail.setUnitPrice(product.getPrice());
                        orderDetail.setSize(cartItem.getSize().getName());
                        orderDetail.setProduct(product);
                        //Check if product has enough stock
                        decreaseProductStock(product, cartItem.getQuantity());
                        //Check if product variant has enough stock
                        ProductVariant productVariant = productVariantRepository.findBySizeNameAndProduct(cartItem.getSize().getName(), product)
                                .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_EXISTED));
                        int productVariantStockRemaining = productVariant.getQuantity() - cartItem.getQuantity();
                        if (productVariantStockRemaining < 0)
                            throw new AppException(ErrorCode.PRODUCT_VARIANT_NOT_ENOUGH_STOCK);
                        //decrease product variant stock
                        productVariant.setQuantity(productVariantStockRemaining);

                        return orderDetail;
                    })
                    .collect(Collectors.toList());
            //Delete Cart
            User user = cart.getUser();
            //Remove relation between cart and user in user before delete cart
            user.setCart(null);
        //Remember Phone and address when user checkout
        order.getUser().setAddress(order.getAddress());
        order.getUser().setPhone(order.getPhone());
            userRepository.save(user);
            cartRepository.delete(cart);

        order.setOrderProducts(orderDetails);
        //Save Order
        orderRepository.save(order);
        return CheckoutResponse.builder()
                .order(OrderMapper.INSTANCE.toOrderResponse(order))
                .build();
    }

    public CheckoutResponse buyNow(BuyNowRequest request) {
        //Check exist Product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        //Check if product has enough stock
        decreaseProductStock(product, request.getQuantity());
        //Check if product variant has enough stock
        ProductVariant productVariant = productVariantRepository.findBySizeNameAndProduct(request.getSize(), product)
                .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_EXISTED));
        int productVariantStockRemaining = productVariant.getQuantity() - request.getQuantity();
        if (productVariantStockRemaining < 0)
            throw new AppException(ErrorCode.PRODUCT_VARIANT_NOT_ENOUGH_STOCK);
        //decrease product variant stock
        productVariant.setQuantity(productVariantStockRemaining);
        //Create Order
        Order order = createOrderObject(request);
        OrderDetail orderDetail =OrderDetail.builder()
                .order(order)
                .product(product)
                .quantity(request.getQuantity())
                .total(request.getQuantity())
                .build();
        order.setPaymentId(request.getPaymentId());
        //Snapshot product
        orderDetail.setProductName(product.getName());
        orderDetail.setQuantity(request.getQuantity());
        orderDetail.setUnitPrice(product.getPrice());
        orderDetail.setSize(request.getSize());

        List<OrderDetail> orderDetails = new ArrayList<>();
        orderDetails.add(orderDetail);
        order.setOrderProducts(orderDetails);
        //Remember Phone and address when user checkout
        order.getUser().setAddress(order.getAddress());
        order.getUser().setPhone(order.getPhone());
        order.setPaymentId(request.getPaymentId());
        //Save Order
        orderRepository.save(order);
        productRepository.save(product);
        //Map Order to OrderResponse
        return CheckoutResponse.builder()
                .order(OrderMapper.INSTANCE.toOrderResponse(order))
                .build();
    }

    public List<CheckoutResponse> getMyOrder(){
        User user = userService.getCurrentUser();
        List<Order> orders = user.getOrders();
        return  orders.stream().map(order -> {
            OrderResponse orderResponse = OrderMapper.INSTANCE.toOrderResponse(order);
            CheckoutResponse checkoutResponse = new CheckoutResponse();
            checkoutResponse.setOrder(orderResponse);
            return checkoutResponse;
        }).collect(Collectors.toList());
    }

    public List<CheckoutResponse> getAllOrder(){
        return orderRepository.findAll().stream().map(order -> {
            OrderResponse orderResponse = OrderMapper.INSTANCE.toOrderResponse(order);
            CheckoutResponse checkoutResponse = new CheckoutResponse();
            checkoutResponse.setOrder(orderResponse);
            return checkoutResponse;
        }).collect(Collectors.toList());
    }

    public OrderResponse getOrder(String orderId) {
        //Check if Order exist
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        User user = userService.getCurrentUser();
        //Check if user is Member and not his/her order
        if (!user.getUserId().equals(order.getUser().getUserId())
                && user.getRole().equals(Role.CUSTOMER.name()))
            throw new AppException(ErrorCode.DID_NOT_OWN_ORDER);
        return OrderMapper.INSTANCE.toOrderResponse(order);
    }

    private void decreaseProductStock(Product product, int quantity) {
        //Check if product is active
        if (!product.isStatus()) {
            throw new AppException(ErrorCode.PRODUCT_IS_INACTIVE);
        }
        //Check if product has enough stock
        int productStockRemaining = product.getStock() - quantity;
        if (productStockRemaining < 0)
            throw new AppException(ErrorCode.PRODUCT_NOT_ENOUGH_STOCK);
        //If stock remaining is 0, set status unavailable
        if(productStockRemaining == 0)
            product.setStatus(false);
        //Decrease stock of product
        product.setStock(productStockRemaining);
        productRepository.save(product);
    }

    private Order createOrderObject(CheckoutRequest request) {
        return getOrder(orderMapper.toOrder(request), request.getCartId());
    }

    private Order createOrderObject(BuyNowRequest request) {
        return getOrder(orderMapper.toOrder(request), null);
    }

    private Order getOrder(Order order, String cartId) {
        //Get user who is login
        User user;
            user = userService.getCurrentUser();
            if (cartId != null) {
                Cart cart = cartRepository.findById(cartId)
                        .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));
                if (!cart.getUser().getUserId().equals(user.getUserId())) {
                    throw new AppException(ErrorCode.DID_NOT_OWN_CART);
                }
            }//If member, check this cart is his/her own
        order.setCreatedDate(new Date(Instant.now().toEpochMilli()));
        order.setStatus(Status.PENDING.name());
        order.setUser(user);
        try {
            return orderRepository.save(order);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.PAYMENT_ID_EXISTED);
        }
    }
}
