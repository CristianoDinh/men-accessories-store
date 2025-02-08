package com.isp392.ecommerce.repository;

import com.isp392.ecommerce.entity.Product;
import com.isp392.ecommerce.entity.ProductVariant;
import com.isp392.ecommerce.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, String> {
    Optional<ProductVariant> findBySizeNameAndProduct(String size_name, Product product);
    @Query("SELECT pv FROM ProductVariant pv WHERE pv.size.sizeId = :sizeId AND pv.product.productId = :productId")
    Optional<ProductVariant> findBySizeIdAndProductId(@Param("sizeId") int sizeId, @Param("productId") String productId);
}
