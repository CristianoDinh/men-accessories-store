package com.isp392.ecommerce.controller;

import com.isp392.ecommerce.dto.request.SizeCreateRequest;
import com.isp392.ecommerce.dto.response.ApiResponse;
import com.isp392.ecommerce.entity.Size;
import com.isp392.ecommerce.service.SizeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/size")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SizeController {

    SizeService sizeService;

    @PostMapping("/create")
    ApiResponse<Size> createSize(@RequestBody SizeCreateRequest request) {
        return ApiResponse.<Size>builder()
                .message("Create size successfully")
                .result(sizeService.createSize(request))
                .build();
    }
}
