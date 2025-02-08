package com.isp392.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "product_id", nullable = false)
    private String productId;
    private String name;
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    private boolean status;
    @Column(columnDefinition = "TEXT")
    private String image;
    private int stock;
    private float price;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Ngăn chặn tuần hoàn khi ánh xạ ngược
    private List<ProductVariant> productVariants;

}


