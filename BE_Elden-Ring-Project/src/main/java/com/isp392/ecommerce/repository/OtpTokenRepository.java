package com.isp392.ecommerce.repository;

import com.isp392.ecommerce.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Integer> {
}
