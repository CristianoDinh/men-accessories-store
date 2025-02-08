import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
// import styles
import "../../../styles/components/private/refund/refund.css";
// import slices
import {
  toggleAnimateRefundModalOn,
  togglePreviewRefundModalOn,
} from "../../../redux/slices/modal/modal";
import { setRefundInfo } from "../../../redux/slices/refund/refund";
// import service
import * as RefundService from "../../../service/refund/refund";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
export const RefundList = () => {
  // dispatch
  const dispatch = useDispatch();
  // state
  const [isServerError, setIsServerError] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isEmptyList, setIsEmptyList] = useState(false);
  // query
  const {
    data: refundList = [],
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["all-refunds"],
    queryFn: RefundService.getAllRefund,
  });
  // handle func
  const handleToggleRefundDetailModalOn = (refundInfo) => {
    dispatch(setRefundInfo(refundInfo));
    dispatch(togglePreviewRefundModalOn());
    setTimeout(() => {
      dispatch(toggleAnimateRefundModalOn());
    }, 1);
  };
  useEffect(() => {
    if (isLoading || isFetching) {
      setIsLoadingPage(true);
    } else {
      setIsLoadingPage(false);
    }
    if (isError) {
      setIsServerError(true);
    } else {
      setIsServerError(false);
    }
    if (refundList?.length === 0) {
      setIsEmptyList(true);
    } else {
      setIsEmptyList(false);
    }
  }, [isLoading, isFetching, isError]);
  const countApprovedRefund = () => {
    return refundList.filter((refund) => refund?.status === "APPROVED").length;
  };
  const countPendingRefund = () => {
    return refundList.filter((refund) => refund?.status === "PENDING").length;
  };
  return (
    <div className="refund-list-container">
      <div className="utils">
        <div className="item-container">
          <div className="item">
            <div>
              <p>Total invoice refunded</p>
              <i className="bx bx-x-circle"></i>
            </div>
            <strong>{countApprovedRefund()} invoices</strong>
            <small>from {refundList?.length} requests</small>
          </div>
        </div>
        <div className="item-container">
          <div className="item">
            <div>
              <p>Wating request</p>
              <i className="bx bx-error-alt"></i>
            </div>
            <strong>{countPendingRefund()} Invoices</strong>
            <small>wating for confirm</small>
          </div>
        </div>
      </div>
      <table className="refund-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Image</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoadingPage ? (
            <>
              <div className="loading">
                <ClipLoader color="#000000" size={40} />
              </div>
            </>
          ) : isServerError ? (
            <>
              <div className="server-error">
                <p>Server is error now, please press F5 to reload again.</p>
              </div>
            </>
          ) : isEmptyList ? (
            <>
              <div className="empty-list">
                <p>Your request list is empty</p>
              </div>
            </>
          ) : (
            <>
              {refundList?.map((refund) => (
                <tr key={refund.refundRequestId}>
                  <td>{refund.orderId}</td>
                  <td>
                    <img src={refund.refundReasonImage} alt="" />
                  </td>
                  <td>{refund.refundReason}</td>
                  {refund.status === "PENDING" && (
                    <td className="pending">
                      <i className="bx bxs-circle"></i>
                      <p>Pending</p>
                    </td>
                  )}
                  {refund.status === "APPROVED" && (
                    <td className="success">
                      <i className="bx bxs-circle"></i>
                      <p>Approved</p>
                    </td>
                  )}
                  {refund.status === "REJECTED" && (
                    <td className="reject">
                      <i className="bx bxs-circle"></i>
                      <p>Rejected</p>
                    </td>
                  )}
                  <td>
                    <i
                      className="bx bx-info-circle"
                      onClick={() => handleToggleRefundDetailModalOn(refund)}
                    ></i>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};
