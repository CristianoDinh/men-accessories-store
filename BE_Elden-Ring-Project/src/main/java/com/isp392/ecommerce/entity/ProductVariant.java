package com.isp392.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private String productVariantId;

    @ManyToOne
    @JoinColumn(name = "size_id")
    @JsonBackReference
    private Size size;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference // Tránh tuần hoàn ở phía Product
    private Product product;

    @Column(name = "quantity", nullable = false)
    private int quantity;
}


