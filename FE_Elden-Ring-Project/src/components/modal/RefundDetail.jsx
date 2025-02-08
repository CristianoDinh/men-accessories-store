import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import styles
import "../../styles/components/modal/modal.css";
// import slices
import {
  toggleAnimateRefundModalOff,
  togglePreviewRefundModalOff,
} from "../../redux/slices/modal/modal";
import * as RefundService from "../../service/refund/refund";
export const RefundDetail = () => {
  // selector
  const isToggleRefundDetailModal = useSelector(
    (state) => state.modal.previewRefundModal.isToggleModal
  );
  const isToggleAnimateRefundDetailModal = useSelector(
    (state) => state.modal.animateRefundModal.isToggleModal
  );
  const refundInfo = useSelector((state) => state.refund.refundInfo.refundInfo);
  // state
  const [isLoadingMutation, setIsLoadingMutation] = useState(false);
  // mutation
  const rejectMutation = useMutation({
    mutationKey: ["reject-order"],
    mutationFn: RefundService.rejectRefund,
    onMutate: () => {
      setIsLoadingMutation(true);
    },
    onSuccess: () => {
      toast.success("Reject request successful", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        setIsLoadingMutation(false);
        location.reload();
      }, 1500);
    },
  });
  const approveMutation = useMutation({
    mutationKey: ["reject-order"],
    mutationFn: RefundService.approveRefund,
    onMutate: () => {
      setIsLoadingMutation(true);
    },
    onSuccess: () => {
      toast.success("Approve request successful", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        setIsLoadingMutation(false);
        location.reload();
      }, 1500);
    },
  });
  // dispatch
  const dispatch = useDispatch();
  //   handle func
  const handleToggleDetailRefundModalOff = () => {
    dispatch(toggleAnimateRefundModalOff());
    setTimeout(() => {
      dispatch(togglePreviewRefundModalOff());
    }, 800);
  };
  const handleRejectOrder = async () => {
    try {
      await rejectMutation.mutateAsync(refundInfo?.orderId);
    } catch (error) {
      console.log(error);
    }
  };
  const handleApproveOrder = async () => {
    try {
      await approveMutation.mutateAsync(refundInfo?.orderId);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={
        isToggleRefundDetailModal
          ? `detail-refund-container`
          : `detail-refund-close`
      }
    >
      <ToastContainer />
      <div
        className={
          isToggleAnimateRefundDetailModal
            ? `detail-refund-modal open`
            : `detail-refund-modal close`
        }
      >
        <div className="header">
          <strong>Refund Request</strong>
          <i className="bx bx-x" onClick={handleToggleDetailRefundModalOff}></i>
        </div>
        {refundInfo?.status === "PENDING" && (
          <div className="pending">
            <i className="bx bx-loader"></i>
            <p>Refund request is wating for admin confirm.</p>
          </div>
        )}
        {refundInfo?.status === "APPROVED" && (
          <div className="success">
            <i className="bx bx-check"></i>
            <p>This request had been approved, please prepare for refund.</p>
          </div>
        )}
        {refundInfo?.status === "REJECTED" && (
          <div className="reject">
            <i className="bx bx-x"></i>
            <p>This request had been rejected, please mail to customer.</p>
          </div>
        )}
        <div className="refund-info">
          <img src={refundInfo?.refundReasonImage} alt="" />
          <div className="reason">
            <strong>Reason</strong>
            <p>{refundInfo?.refundReason}</p>
          </div>
        </div>
        <div className="buttons">
          {refundInfo?.status === "PENDING" && (
            <>
              <button onClick={handleApproveOrder} disabled={isLoadingMutation}>
                <i className="bx bx-check"></i>
                <p>Mark as Success</p>
              </button>
              <button onClick={handleRejectOrder} disabled={isLoadingMutation}>
                <i className="bx bx-x"></i>
                <p>Mark as Reject</p>
              </button>
            </>
          )}
          {refundInfo?.status === "APPROVED" && (
            <>
              <button disabled className="marked-success">
                <i className="bx bx-check"></i>
                <p>marked as Approved</p>
              </button>
              <button disabled className="marked-success">
                <i className="bx bx-x"></i>
                <p>You have marked as Approved</p>
              </button>
            </>
          )}
          {refundInfo?.status === "REJECTED" && (
            <>
              <button disabled className="marked-reject">
                <i className="bx bx-check"></i>
                <p>You have marked as Reject</p>
              </button>
              <button disabled className="marked-reject">
                <i className="bx bx-x"></i>
                <p>Marked as Reject</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
