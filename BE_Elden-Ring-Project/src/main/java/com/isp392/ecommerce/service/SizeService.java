package com.isp392.ecommerce.service;

import com.isp392.ecommerce.dto.request.SizeCreateRequest;
import com.isp392.ecommerce.entity.Size;
import com.isp392.ecommerce.exception.AppException;
import com.isp392.ecommerce.exception.ErrorCode;
import com.isp392.ecommerce.repository.SizeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SizeService {

    SizeRepository sizeRepository;

    public Size createSize(SizeCreateRequest request) {
        if(sizeRepository.existsByName(request.getName()))
            throw new AppException(ErrorCode.SIZE_EXISTED);

        return sizeRepository.save(Size.builder()
                        .name(request.getName())
                .build());
    }
}
