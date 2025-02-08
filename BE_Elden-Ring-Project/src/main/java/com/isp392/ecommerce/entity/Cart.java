package com.isp392.ecommerce.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import jakarta.persistence.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "carts")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Cart {

    @Id
    @Column(name = "cartId", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    String cartId;

    @JsonBackReference
    @OneToOne
    @JoinColumn(name = "userId")
    User user;

    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name = "createDate")
    Date createDate;

    @JsonManagedReference
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    List<CartItem> cartItems;
}
