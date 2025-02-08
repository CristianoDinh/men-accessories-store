package com.isp392.ecommerce.repository;

import com.isp392.ecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    boolean existsByCateName(String cateName);
}
