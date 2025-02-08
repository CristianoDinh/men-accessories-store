package com.isp392.ecommerce.repository;

import com.isp392.ecommerce.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SizeRepository extends JpaRepository<Size, Integer> {
    boolean existsByName(String name);
    Optional<Size> findByName(String name);
}
