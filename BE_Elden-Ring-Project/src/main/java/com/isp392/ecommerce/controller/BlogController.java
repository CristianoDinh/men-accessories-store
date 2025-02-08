package com.isp392.ecommerce.controller;


import com.isp392.ecommerce.dto.request.BlogCreateRequest;
import com.isp392.ecommerce.dto.request.BlogUpdateRequest;
import com.isp392.ecommerce.dto.response.ApiResponse;
import com.isp392.ecommerce.dto.response.BlogResponse;
import com.isp392.ecommerce.entity.Blog;
import com.isp392.ecommerce.service.BlogService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blog")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BlogController {

    BlogService blogService;

    @PostMapping("/create")
    ApiResponse<Blog> createBlog(@RequestBody BlogCreateRequest request) {

        return ApiResponse.<Blog>builder()
                .message("Create blog successfully")
                .result(blogService.createBlog(request))
                .build();

    }

    @GetMapping("/list")
    ApiResponse<List<BlogResponse>> getAllBlogs() {
        return ApiResponse.<List<BlogResponse>>builder()
                .message("Get all blogs successfully")
                .result(blogService.getAllBlogs())
                .build();
    }

    @PutMapping("/update/{blogId}")
    ApiResponse<Blog> updateBlog(@PathVariable String blogId, @RequestBody BlogUpdateRequest request) {
        return ApiResponse.<Blog>builder()
                .message("Update Blog successfully")
                .result(blogService.updateBlog(blogId, request))
                .build();
    }

    @DeleteMapping("/delete/{blogId}")
    ApiResponse<Boolean> deleteBlog(@PathVariable String blogId) {
        blogService.deleteBlog(blogId);
        return ApiResponse.<Boolean>builder()
                .message("Delete blog successfully")
                .result(true)
                .build();
    }

    @GetMapping("/{blogId}")
    ApiResponse<BlogResponse> getBlog(@PathVariable String blogId) {
        return ApiResponse.<BlogResponse>builder()
                .message("Get blog successfully")
                .result(blogService.getBlog(blogId))
                .build();
    }

    @GetMapping("/user/{userId}")
    ApiResponse<List<BlogResponse>> getUserBlog(@PathVariable String userId) {
        return ApiResponse.<List<BlogResponse>>builder()
                .message("Get blog successfully")
                .result(blogService.getUserBlog(userId))
                .build();
    }

}
