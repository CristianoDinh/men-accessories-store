import { useSelector } from "react-redux";
// import styles
import "../../styles/public/my-order/my-order.css";
// import components
import { SettingNav } from "../../components/navbar/SettingNav";
import { MyOrderList } from "../../components/public/my-order/MyOrderList";
import { MyOrderDetail } from "../../components/modal/MyOrderDetail";
import { CancelOrderModal } from "../../components/modal/CancelOrderModal";
import { CreateRefundModal } from "../../components/modal/CreateRefundModal";
export const CustomerOrderPage = () => {
  // selector
  const isToggleCancelOrderModal = useSelector(
    (state) => state.modal.cancelOrderModal.isToggleModal
  );
  const isToggleRefundRequestModal = useSelector(
    (state) => state.modal.refundRequestModal.isToggleModal
  );
  return (
    <div className="customer-order-container">
      {isToggleRefundRequestModal && <CreateRefundModal />}
      {isToggleCancelOrderModal && <CancelOrderModal />}
      <MyOrderDetail />
      <SettingNav />
      <div className="customer-order">
        <div className="header">
          <strong>Order History</strong>
        </div>
        <MyOrderList />
      </div>
    </div>
  );
};
