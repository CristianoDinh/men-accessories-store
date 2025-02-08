package com.isp392.ecommerce.repository;

import com.isp392.ecommerce.entity.RefundRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefundRequestRepository extends JpaRepository<RefundRequest, String > {
}
