package com.isp392.ecommerce.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.isp392.ecommerce.dto.request.CreateCategoryRequest;
import com.isp392.ecommerce.dto.response.ApiResponse;
import com.isp392.ecommerce.dto.response.CategoryResponse;
import com.isp392.ecommerce.entity.Category;
import com.isp392.ecommerce.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {

    CategoryService categoryService;

    @PostMapping("/create")
    ApiResponse<Category> createCategory(@RequestBody CreateCategoryRequest request) {
        return ApiResponse.<Category>builder()
                .message("Create category successfully")
                .result(categoryService.createCategory(request))
                .build();
    }

    @GetMapping("/list")
    ApiResponse<List<Category>> getAllCategories() {
        return ApiResponse.<List<Category>>builder()
                .message("Get all categories successfully")
                .result(categoryService.getAllCategories())
                .build();
    }

    @GetMapping("/{cateId}")
    ApiResponse<CategoryResponse> getCategory(@PathVariable int cateId) {
        return ApiResponse.<CategoryResponse>builder()
                .message("Get category successfully")
                .result(categoryService.getCategory(cateId))
                .build();
    }

    @GetMapping("/shop/{cateId}")
    ApiResponse<CategoryResponse> getActiveCategory(@PathVariable int cateId) {
        return ApiResponse.<CategoryResponse>builder()
                .message("Get category successfully")
                .result(categoryService.getActiveCategory(cateId))
                .build();
    }

    @DeleteMapping("/{cateId}")
    ApiResponse<Void> deleteCategory(@PathVariable int cateId) {
        categoryService.deleteCategory(cateId);
        return ApiResponse.<Void>builder()
                .message("Delete category successfully")
                .build();
    }

}
