package com.isp392.ecommerce.service;

import com.isp392.ecommerce.dto.request.HandleRefundRequestRequest;
import com.isp392.ecommerce.dto.request.RefundRequestRequest;
import com.isp392.ecommerce.dto.response.RefundRequestResponse;
import com.isp392.ecommerce.entity.Order;
import com.isp392.ecommerce.entity.RefundRequest;
import com.isp392.ecommerce.entity.User;
import com.isp392.ecommerce.enums.Role;
import com.isp392.ecommerce.enums.Status;
import com.isp392.ecommerce.exception.AppException;
import com.isp392.ecommerce.exception.ErrorCode;
import com.isp392.ecommerce.mapper.RefundRequestMapper;
import com.isp392.ecommerce.repository.OrderRepository;
import com.isp392.ecommerce.repository.RefundRequestRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RefundRequestService {
    RefundRequestRepository refundRequestRepository;
    OrderRepository orderRepository;
    RefundRequestMapper refundRequestMapper;
    UserService userService;

    public RefundRequestResponse makeARefund(RefundRequestRequest request) {
        //Check if order exist
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        //Check if already refund
        if (order.getRefundRequest() != null)
            throw new AppException(ErrorCode.ALREADY_REQUEST_REFUNDED);
        //Check if order is already approved
        if (order.getStatus().equals(Status.PENDING.name()))
            throw new AppException(ErrorCode.ORDER_IS_PENDING);
        else if (order.getStatus().equals(Status.REJECTED.name()))
            throw new AppException(ErrorCode.ORDER_IS_REJECTED);
        //map request to RefundRequest Object to save
        RefundRequest refundRequest = refundRequestMapper.toRefundRequest(request);
        refundRequest.setOrder(order);
        refundRequest.setStatus(Status.PENDING.name());
        return refundRequestMapper.toRefundRequestResponse(refundRequestRepository.save(refundRequest));//map to response
    }

    @PreAuthorize("hasRole('ADMIN')")
    public RefundRequestResponse handleRefund(HandleRefundRequestRequest request, String status) {
        //Check if order exist
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        //Check refund request exist
        RefundRequest refundRequest = order.getRefundRequest();
        if (refundRequest == null)
            throw new AppException(ErrorCode.REFUND_REQUEST_NOT_FOUND);
        //Check if refund request already be handled
        if (refundRequest.getStatus().equals(Status.APPROVED.name()))
            throw new AppException(ErrorCode.ALREADY_APPROVED_REFUND_REQUEST);
        //map request to RefundRequest Object to save
        refundRequestMapper.toRefundRequest(request);
        //Check if request was approved
        if (status.equals(Status.APPROVED.name())) {
            order.setStatus(Status.REFUNDED.name());
            callPayPalRefundApi(request.getOrderId());
        }
        refundRequest.setStatus(status);
        //Get info admin who pending the refund
        User user = userService.getCurrentUser();
        refundRequest.setAdminId(user.getUserId());
        return refundRequestMapper.toRefundRequestResponse(refundRequestRepository.save(refundRequest));//map to response
    }


    @PreAuthorize("hasRole('ADMIN')")
    public List<RefundRequestResponse> getAllRefundRequests() {
        List<RefundRequest> refundRequests = refundRequestRepository.findAll();
        return refundRequests.stream()
                .map(refundRequestMapper::toRefundRequestResponse)
                .collect(Collectors.toList());
    }

    public RefundRequestResponse getRefundRequestById(String refundRequestId) {
        RefundRequest refundRequest = refundRequestRepository.findById(refundRequestId)
                .orElseThrow(() -> new AppException(ErrorCode.REFUND_REQUEST_NOT_FOUND));
        User user = userService.getCurrentUser();
        //Check if user is Member and not his/her order
        if (!user.getUserId().equals(refundRequest.getOrder().getUser().getUserId())
                && user.getRole().equals(Role.CUSTOMER.name()))
            throw new AppException(ErrorCode.DID_NOT_OWN_ORDER);
        return refundRequestMapper.toRefundRequestResponse(refundRequest);
    }

    protected void callPayPalRefundApi(String orderId) {
        String refundEndpoint = "http://localhost:8080/payment/refund?orderId=" + orderId;
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getForEntity(refundEndpoint, Void.class);
    }
}
