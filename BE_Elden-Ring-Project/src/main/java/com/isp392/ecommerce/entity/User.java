package com.isp392.ecommerce.entity;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "accounts")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "full_name", columnDefinition = "NVARCHAR(MAX)")
    private String fullName;

    @Column(name = "role")
    private String role;

    @Column(name = "password")
    private String password;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "address", columnDefinition = "NVARCHAR(MAX)")
    private String address;

    private boolean googleAccount;

    private boolean status;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Blog> blogs;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders;

    @JsonManagedReference
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;

    @PrePersist
    protected void onCreate(){
        if (!this.status)
            this.status = true;
    }
}
