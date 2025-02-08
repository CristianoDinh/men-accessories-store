package com.isp392.ecommerce.entity;

import java.util.Date;
import java.util.List;

import lombok.*;
import jakarta.persistence.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orders")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "order_id", nullable = false, unique = true)
    String orderId;

    @Column(name = "PaymentId", nullable = false, unique = true)
    String paymentId;

    @Column(name = "status")
    String status;

    @Column(name = "created_date", nullable = false)
    Date createdDate;

    @Column(name = "total_price", nullable = false)
    float total;

    @Column(name = "phone", length = 10)
    String phone;

    @Column(name = "address", columnDefinition = "NVARCHAR(MAX)")
    String address;

    @Column(name = "email")
    String email;

    @Column(name = "fullname", columnDefinition = "NVARCHAR(MAX)")
    String fullname;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consumer_id", nullable = false)
    User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("productName DESC")
    List<OrderDetail> orderProducts;

    @OneToOne(mappedBy = "order")
    RefundRequest refundRequest;
}
