package com.isp392.ecommerce.entity;


import lombok.*;
import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "order_details")
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String orderDetailId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private String productName;
    private float unitPrice;
    @Column(name = "description", columnDefinition = "VARCHAR(MAX)")
    private String description;
    private String size;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;


    @Column(name = "total")
    private float total;
}

