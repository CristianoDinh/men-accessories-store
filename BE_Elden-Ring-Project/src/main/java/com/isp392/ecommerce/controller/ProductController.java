package com.isp392.ecommerce.controller;

import com.isp392.ecommerce.dto.request.ProductCreateRequest;
import com.isp392.ecommerce.dto.request.ProductUpdateRequest;
import com.isp392.ecommerce.dto.request.UserCreationRequest;
import com.isp392.ecommerce.dto.request.UserUpdateRequest;
import com.isp392.ecommerce.dto.response.ApiResponse;
import com.isp392.ecommerce.dto.response.ProductResponse;
import com.isp392.ecommerce.entity.Product;
import com.isp392.ecommerce.entity.User;
import com.isp392.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @CrossOrigin

    @PostMapping("/create")
    ApiResponse<ProductResponse> create(@RequestBody @Valid ProductCreateRequest productCreateRequest) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.createProduct(productCreateRequest))
                .build();
    }

    @GetMapping("/{productId}")
    ApiResponse<ProductResponse> getProduct(@PathVariable String productId) {
        return ApiResponse.<ProductResponse>builder()
                .message("Get product successfully")
                .result(productService.getProduct(productId))
                .build();
    }

    @GetMapping("/list")
    ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Get all products successfully")
                .result(productService.getAllProduct())
                .build();
    }

    @PutMapping("/update/{productId}")
    ApiResponse<ProductResponse> updateProduct(@PathVariable String productId, @RequestBody ProductUpdateRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .message("Update product successfully")
                .result(productService.updateProduct(productId, request))
                .build();
    }

    @DeleteMapping("/delete/{productId}")
    ApiResponse<Void> deleteProduct(@PathVariable String productId) {
        productService.deleteProduct(productId);
        return ApiResponse.<Void>builder()
                .message("Delete product successfully")
                .build();
    }

    @GetMapping("/shop")
    ApiResponse<List<ProductResponse>> getAllActiveProducts() {
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Get all active product successfully")
                .result(productService.getAllActiveProducts())
                .build();
    }
}


