package com.isp392.ecommerce.repository;

import com.isp392.ecommerce.entity.Cart;
import com.isp392.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {
    boolean existsByUser(User user);
}
