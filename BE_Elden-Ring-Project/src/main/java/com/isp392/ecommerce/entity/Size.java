package com.isp392.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "sizes")
public class Size {
    @Id
    @Column(name = "size_id", nullable = false, unique = true)
    private int sizeId;

    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "size", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> productVariants;
}
