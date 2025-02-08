package com.isp392.ecommerce.service;

import com.isp392.ecommerce.dto.request.CreateCategoryRequest;
import com.isp392.ecommerce.dto.response.CategoryResponse;
import com.isp392.ecommerce.dto.response.ProductResponse;
import com.isp392.ecommerce.entity.Category;
import com.isp392.ecommerce.entity.Product;
import com.isp392.ecommerce.exception.AppException;
import com.isp392.ecommerce.exception.ErrorCode;
import com.isp392.ecommerce.repository.CategoryRepository;
import com.isp392.ecommerce.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    ProductService productService;

    ProductRepository productRepository;

    public Category createCategory(CreateCategoryRequest request) {
        if(categoryRepository.existsByCateName(request.getCateName()))
            throw new AppException(ErrorCode.CATEGORY_EXISTED);

        return categoryRepository.save(Category.builder()
                        .cateName(request.getCateName())
                .build());
    }


    public List<Category> getAllCategories() {
        return categoryRepository.findAll().stream().toList();
    }

    public CategoryResponse getCategory(int id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        List<ProductResponse> productResponseList = category.getProducts().stream()
                .map(product -> {
                    CategoryResponse categoryResponse = CategoryResponse.builder()
                            .cateId(product.getCategory().getCateId())
                            .cateName(product.getCategory().getCateName())
                            .build();
                    return ProductResponse.builder()
                            .productId(product.getProductId())
                            .name(product.getName())
                            .image(product.getImage())
                            .price(product.getPrice())
                            .stock(product.getStock())
                            .description(product.getDescription())
                            .status(product.isStatus())
                            .cateId(product.getCategory().getCateId())
                            .cateName(product.getCategory().getCateName())
                            .build();
                }).toList();

        List<Product> products = productRepository.findByStatusTrue().stream().toList();

        return CategoryResponse.builder()
                .cateId(category.getCateId())
                .cateName(category.getCateName())
                .products(productResponseList)
                .build();
    }

    public CategoryResponse getActiveCategory(int id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        List<ProductResponse> productResponseList = category.getProducts().stream()
                .filter(Product::isStatus)
                .map(product -> {
                    CategoryResponse categoryResponse = CategoryResponse.builder()
                            .cateId(product.getCategory().getCateId())
                            .cateName(product.getCategory().getCateName())
                            .build();
                    return ProductResponse.builder()
                            .productId(product.getProductId())
                            .name(product.getName())
                            .image(product.getImage())
                            .price(product.getPrice())
                            .stock(product.getStock())
                            .description(product.getDescription())
                            .status(product.isStatus())
                            .cateId(product.getCategory().getCateId())
                            .cateName(product.getCategory().getCateName())
                            .build();
                }).toList();

        List<Product> products = productRepository.findByStatusTrue().stream().toList();

        return CategoryResponse.builder()
                .cateId(category.getCateId())
                .cateName(category.getCateName())
                .products(productResponseList)
                .build();
    }



    public void deleteCategory(int id) {
        categoryRepository.deleteById(id);
    }
}
