package com.isp392.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cart_items")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItem {

    @Id
    @Column(name = "cartItemId", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    String cartItemId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cartId") // Sửa tên cột thành cartId (nếu đúng)
    Cart cart;

    @JsonIgnoreProperties({"cartItems"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "size_id") // Liên kết với Size
    Size size;

    @Column(name = "quantity", nullable = false)
    int quantity;

    public String getCateName() {
        return (product != null && product.getCategory() != null)
                ? getProduct().getCategory().getCateName() : null;
    }

}

