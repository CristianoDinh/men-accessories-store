package com.isp392.ecommerce.mapper;


import com.isp392.ecommerce.dto.request.BlogCreateRequest;
import com.isp392.ecommerce.dto.request.BlogUpdateRequest;
import com.isp392.ecommerce.entity.Blog;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper
public interface BlogMapper {

    Blog toBlog(@MappingTarget Blog blog, BlogCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBlog(@MappingTarget Blog blog, BlogUpdateRequest request);
}
