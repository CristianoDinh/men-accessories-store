package com.isp392.ecommerce.mapper;


import com.isp392.ecommerce.dto.request.HandleRefundRequestRequest;
import com.isp392.ecommerce.dto.request.RefundRequestRequest;
import com.isp392.ecommerce.dto.response.RefundRequestResponse;
import com.isp392.ecommerce.entity.RefundRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface RefundRequestMapper {
    RefundRequest toRefundRequest(RefundRequestRequest refundRequestRequest);
    RefundRequest toRefundRequest(HandleRefundRequestRequest rejectRefundRequest);
    @Mapping(source = "order.orderId", target = "orderId")
    RefundRequestResponse toRefundRequestResponse(RefundRequest refundRequest);

}
