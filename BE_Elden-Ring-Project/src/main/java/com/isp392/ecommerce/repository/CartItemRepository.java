package com.isp392.ecommerce.repository;

import com.isp392.ecommerce.entity.CartItem;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM cart_items WHERE cart_item_id = :cartItemId", nativeQuery = true)
    void deleteCartItemById(@Param("cartItemId") String cartItemId);
}
