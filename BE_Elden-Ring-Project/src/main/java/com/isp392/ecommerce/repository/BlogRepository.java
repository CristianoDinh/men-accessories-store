package com.isp392.ecommerce.repository;

import com.isp392.ecommerce.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Blog, String> {

}
