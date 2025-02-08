import { useSelector, useDispatch } from "react-redux";
// import styles
import "../../styles/components/modal/modal.css";
import {
  toggleAnimateMyOrderModalOff,
  toggleCancelOrderModal,
  togglePreviewMyOrderModalOff,
  toggleRefundRequestModal,
} from "../../redux/slices/modal/modal";
// import slices
export const MyOrderDetail = () => {
  // selector
  const isToggleMyOrderDetailModal = useSelector(
    (state) => state.modal.previewMyOrderModal.isToggleModal
  );
  const isToggleAnimateMyOrderDetailModal = useSelector(
    (state) => state.modal.animateMyOrderModal.isToggleModal
  );
  const orderInfo = useSelector((state) => state.order.orderInfo.orderInfo);
  // dispatch
  const dispatch = useDispatch();
  //   handle func
  const handleToggleDetailMyOrderModalOff = () => {
    dispatch(toggleAnimateMyOrderModalOff());
    setTimeout(() => {
      dispatch(togglePreviewMyOrderModalOff());
    }, 800);
  };
  const handleToggleCancelOrderModal = () => {
    dispatch(toggleCancelOrderModal());
  };
  const handleToggleRefundRequestModal = () => {
    dispatch(toggleRefundRequestModal());
  };
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  const formatTime = (dateString) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleTimeString("en-GB", options);
  };
  const calculateTotalItemPrice = (price, quantity) => {
    return price * quantity;
  };
  const totalOrderValue = () => {
    return orderInfo?.order?.orderDetails?.reduce((total, item) => {
      return total + calculateTotalItemPrice(item.unitPrice, item.quantity);
    }, 0);
  };
  return (
    <div
      className={
        isToggleMyOrderDetailModal
          ? `detail-myorder-container`
          : `detail-myorder-close`
      }
    >
      <div
        className={
          isToggleAnimateMyOrderDetailModal
            ? `detail-myorder-modal open`
            : `detail-myorder-modal close`
        }
      >
        <div className="header">
          <strong>My Invoice</strong>
          <i
            className="bx bx-x"
            onClick={handleToggleDetailMyOrderModalOff}
          ></i>
        </div>
        {orderInfo?.order?.status === "PENDING" && (
          <div className="pending">
            <i className="bx bx-loader"></i>
            <p>
              Invoice is wating for admin confirm, you had paid on{" "}
              {formatDate(orderInfo?.order?.createdDate)}
            </p>
          </div>
        )}
        {orderInfo?.order?.status === "APPROVED" && (
          <div className="approved">
            <i className="bx bx-check"></i>
            <p>
              Your order had been approved, we will deliver as quickly as
              possible.
            </p>
          </div>
        )}
        {orderInfo?.order?.status === "REJECTED" && (
          <div className="rejected">
            <i className="bx bx-x"></i>
            <p>
              Your order is cancelled, if you have any questions please contact
              email eldering@gmail.com
            </p>
          </div>
        )}
        {orderInfo?.order?.status === "REFUNDED" && (
          <div className="refunded">
            <i className="bx bx-sync"></i>
            <p>
              Your refund request has been approved, we will process the refund
              within 1 day.
            </p>
          </div>
        )}
        <div className="myorder-infomation">
          <div className="list">
            <div className="two-items">
              <div className="item">
                <p>Name</p>
                <strong>{orderInfo?.order?.fullname}</strong>
              </div>
              <div className="item">
                <p>Email</p>
                <strong>{orderInfo?.order?.email}</strong>
              </div>
            </div>
            <div className="two-items">
              <div className="item">
                <p>Address</p>
                <strong>{orderInfo?.order?.address}</strong>
              </div>
              <div className="item">
                <p>Phone</p>
                <strong>{orderInfo?.order?.phone}</strong>
              </div>
            </div>
          </div>
          <div className="list">
            <div className="two-items">
              <div className="item">
                <p>Date</p>
                <strong>{formatDate(orderInfo?.order?.createdDate)}</strong>
              </div>
              <div className="item">
                <p>Time</p>
                <strong>{formatTime(orderInfo?.order?.createdDate)}</strong>
              </div>
            </div>
            <div className="two-items">
              <div className="item">
                <p>Payment ID</p>
                <strong>{orderInfo?.order?.paymentId}</strong>
              </div>
              <div className="item">
                <p>Payment method</p>
                <strong>Paypal</strong>
              </div>
            </div>
          </div>
          <div className="myorder-cart">
            <label htmlFor="">Items</label>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Quantity</th>
                  <th>Total amount</th>
                </tr>
              </thead>
              <tbody>
                {orderInfo?.order?.orderDetails?.map((item) => (
                  <tr key={item.orderDetailId}>
                    <td>{item.productName}</td>
                    <td>{formatPrice(item.unitPrice)}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {formatPrice(
                        calculateTotalItemPrice(item.unitPrice, item.quantity)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <div className="total">
                <strong>Total</strong>
                <strong>{formatPrice(totalOrderValue())}</strong>
              </div>
            </table>
          </div>
        </div>
        <div className="buttons">
          {orderInfo?.order?.status === "REJECTED" && (
            <div className="rejected-messege">
              <strong>
                Important: this order status now is "REJECTED", we are going to
                refund within 1 day
              </strong>
            </div>
          )}
          {orderInfo?.order?.status === "PENDING" && (
            <button onClick={handleToggleCancelOrderModal}>
              I want to cancel order
            </button>
          )}
          {orderInfo?.order?.status === "APPROVED" && (
            <>
              <div className="note">
                <strong className="refund-text">
                  If you had requested a refund, here is some infomation:
                </strong>
                <p className="refund-text-item">
                  1. We will handle your refund request within 2-3 days
                </p>
                <p className="refund-text-item">
                  2. If your request is approved, we will refund to your PAYPAL
                  account within 1 day.
                </p>
                <p className="refund-text-item">
                  3. But if your request is rejected, your order status still
                  'APPROVED', we will send to your email the reason of
                  rejection.
                </p>
                <strong className="contact">
                  If you have any questions, please contact email:
                  eldenring@gmail.com. We will resolve it as soon as possible
                </strong>
                <button onClick={handleToggleRefundRequestModal}>
                  I want to refund
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
