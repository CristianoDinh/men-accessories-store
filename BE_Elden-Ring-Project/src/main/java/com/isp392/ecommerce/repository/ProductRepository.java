package com.isp392.ecommerce.repository;


import com.isp392.ecommerce.entity.Product;
import com.isp392.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    Optional<Product> findByproductId(String name);
    List<Product> findByStatusTrue();
}
