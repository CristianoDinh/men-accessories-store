package com.isp392.ecommerce.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @Column(name = "category_id", nullable = false)
    private int cateId;

    @Column(name = "category_name", nullable = false)
    private String cateName;

    @JsonManagedReference
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Product> products;
}
