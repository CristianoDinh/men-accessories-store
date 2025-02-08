package com.isp392.ecommerce.service;

import com.isp392.ecommerce.dto.request.ProductCreateRequest;
import com.isp392.ecommerce.dto.request.ProductUpdateRequest;
import com.isp392.ecommerce.dto.request.ProductVariantRequest;
import com.isp392.ecommerce.dto.request.UserCreationRequest;
import com.isp392.ecommerce.dto.response.ProductResponse;
import com.isp392.ecommerce.dto.response.ProductVariantResponse;
import com.isp392.ecommerce.entity.*;
import com.isp392.ecommerce.exception.AppException;
import com.isp392.ecommerce.exception.ErrorCode;
import com.isp392.ecommerce.mapper.ProductMapper;
import com.isp392.ecommerce.repository.CategoryRepository;
import com.isp392.ecommerce.repository.ProductRepository;
import com.isp392.ecommerce.repository.ProductVariantRepository;
import com.isp392.ecommerce.repository.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class  ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private SizeRepository sizeRepository;

    public ProductResponse createProduct(ProductCreateRequest request) {
        // Tìm danh mục từ ID
        Category category = categoryRepository.findById(request.getCateId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        int stock = 0;

        // Tạo đối tượng Product
        Product product = Product.builder()
                .name(request.getName())
                .image(request.getImage())
                .price(request.getPrice())
                .stock(stock) // Bắt đầu với giá trị stock là 0
                .description(request.getDescription())
                .status(request.getStatus())
                .category(category)
                .productVariants(new ArrayList<>()) // Khởi tạo danh sách productVariants trống
                .build();

        // Lưu sản phẩm vào cơ sở dữ liệu
        Product savedProduct = productRepository.save(product);

        // Xử lý và lưu danh sách ProductVariant
        List<ProductVariant> productVariants = new ArrayList<>();
        for (ProductVariantRequest variantRequest : request.getProductVariants()) {
            // Tìm size theo tên
            Size size = sizeRepository.findByName(variantRequest.getSizeName())
                    .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_EXISTED));

            // Cộng dồn quantity vào stock
            stock += variantRequest.getQuantity();

            // Tạo và thêm biến thể
            ProductVariant variant = ProductVariant.builder()
                    .size(size)
                    .quantity(variantRequest.getQuantity())
                    .product(savedProduct) // Liên kết biến thể với sản phẩm đã lưu
                    .build();
            productVariants.add(variant);
        }

        // Cập nhật stock và productVariants cho sản phẩm
        savedProduct.setStock(stock);
        savedProduct.setProductVariants(productVariants);

        // Lưu tất cả biến thể vào cơ sở dữ liệu
        productVariantRepository.saveAll(productVariants);

        // Trả về sản phẩm đã lưu dưới dạng DTO
        return mapToDTO(savedProduct);
    }

    public ProductResponse getProduct(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return mapToDTO(product);
    }

    public List<ProductResponse> getAllProduct() {
        // Lấy tất cả sản phẩm từ cơ sở dữ liệu
        List<Product> products = productRepository.findAll();

        // Chuyển đổi danh sách Product sang danh sách ProductResponse
        return products.stream()
                .map(this::mapToDTO) // Sử dụng phương thức mapToDTO để chuyển đổi
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllActiveProducts() {
        List<Product> products = productRepository.findByStatusTrue().stream().toList();
        return products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProductResponse updateProduct(String id, ProductUpdateRequest request) {
        // Tìm sản phẩm theo ID
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Cập nhật thông tin sản phẩm nếu có
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getImage() != null) {
            product.setImage(request.getImage());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }

        // Cập nhật danh mục nếu có
        if (request.getCateId() != null) {
            Category category = categoryRepository.findById(request.getCateId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
            product.setCategory(category);
        }

        // Tổng số lượng tồn kho
        int totalStock = 0;

        // Lấy danh sách các ProductVariants hiện có của sản phẩm
        List<ProductVariant> currentVariants = product.getProductVariants();

        // Sử dụng Map để quản lý các biến thể hiện có theo tên size
        Map<String, ProductVariant> existingVariantsMap = currentVariants.stream()
                .collect(Collectors.toMap(v -> v.getSize().getName(), v -> v));

        // Tạo một danh sách lưu các size đã được cập nhật từ request
        Set<String> updatedSizes = new HashSet<>();

        // Nếu request có danh sách biến thể
        if (request.getProductVariants() != null) {
            for (ProductVariantRequest variantRequest : request.getProductVariants()) {
                Size size = sizeRepository.findByName(variantRequest.getSizeName())
                        .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_EXISTED));

                // Thêm size vào danh sách các size đã được cập nhật
                updatedSizes.add(variantRequest.getSizeName());

                // Tìm biến thể hiện có theo tên size
                ProductVariant existingVariant = existingVariantsMap.get(variantRequest.getSizeName());

                if (existingVariant != null) {
                    // Nếu biến thể đã tồn tại, cập nhật lại quantity với giá trị mới
                    totalStock += variantRequest.getQuantity(); // Thay số lượng cũ bằng số lượng mới
                    existingVariant.setQuantity(variantRequest.getQuantity());
                } else {
                    // Nếu không tồn tại, tạo mới biến thể và đặt quantity
                    ProductVariant newVariant = ProductVariant.builder()
                            .size(size)
                            .quantity(variantRequest.getQuantity())
                            .product(product)
                            .build();
                    product.getProductVariants().add(newVariant);
                    totalStock += variantRequest.getQuantity();
                }
            }
        }

        // Cộng dồn stock từ các biến thể hiện có mà không nằm trong danh sách đã cập nhật
        for (ProductVariant variant : currentVariants) {
            if (!updatedSizes.contains(variant.getSize().getName())) {
                totalStock += variant.getQuantity(); // Cộng thêm số lượng của biến thể không được cập nhật
            }
        }

        // Cập nhật stock cho sản phẩm
        product.setStock(totalStock);

        // Lưu lại sản phẩm và các biến thể
        productRepository.save(product);
        productVariantRepository.saveAll(product.getProductVariants()); // Lưu tất cả biến thể

        return mapToDTO(product);
    }


    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        productRepository.delete(product);
    }

    private ProductResponse mapToDTO(Product product) {
        List<ProductVariantResponse> variantDTOs = Optional.ofNullable(product.getProductVariants())
                .orElse(Collections.emptyList()) // Nếu productVariants là null, sử dụng danh sách rỗng
                .stream()
                .map(variant -> ProductVariantResponse.builder()
                        .sizeName(variant.getSize().getName())
                        .quantity(variant.getQuantity())
                        .build())
                .collect(Collectors.toList());

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
                .productVariants(variantDTOs)
                .build();
    }

}



